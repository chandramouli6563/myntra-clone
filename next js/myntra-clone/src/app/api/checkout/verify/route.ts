import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET as string;

export async function POST(req: NextRequest) {
        await connectToDatabase();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
                return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
                .createHmac('sha256', RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');

        if (expectedSignature !== razorpay_signature) {
                order.status = 'failed';
                await order.save();
                return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
        }

        order.status = 'processing';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        
        // Set delivery date to 7 days from now
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        order.deliveryDate = deliveryDate;
        
        // Initialize tracking status
        order.trackingStatus = [
                {
                        stage: 'processing',
                        message: 'Order confirmed and being processed',
                        updatedAt: new Date(),
                }
        ];
        
        await order.save();

        return NextResponse.json({ message: 'Payment verified', orderId: order._id });
}

