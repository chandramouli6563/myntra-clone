import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { razorpay } from '@/lib/razorpay';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

function generateOrderNumber(): string {
	return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const body = await req.json();
		const items = Array.isArray(body.items) ? body.items : [];
		const totalAmount = Number(body.totalAmount);
		const userId = body.userId as string;
		if (!items.length || !totalAmount || !userId) {
			return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
		}
		const productIds = items.map((i: any) => i.product);
		const products = await Product.find({ _id: { $in: productIds } });
		const itemsWithSnapshot = items.map((it: any) => {
			const p = products.find((pp: any) => pp._id.toString() === it.product);
			return {
				product: it.product,
				title: p?.title || 'Product',
				image: p?.images?.[0] || '',
				quantity: Number(it.quantity) || 1,
				price: Number(it.price) || Number(p?.price) || 0,
			};
		});

		const order = await Order.create({
			orderNumber: generateOrderNumber(),
			user: userId,
			items: itemsWithSnapshot,
			totalAmount,
			status: 'created',
		});
		const razorOrder = await razorpay.orders.create({
			amount: Math.round(totalAmount * 100),
			currency: 'INR',
			receipt: order._id.toString(),
		});
		order.razorpayOrderId = razorOrder.id as any;
		await order.save();
		return NextResponse.json({ razorOrderId: razorOrder.id, orderId: order._id, orderNumber: order.orderNumber });
	} catch (e: any) {
		return NextResponse.json({ message: e?.message || 'Server error' }, { status: 500 });
	}
}
