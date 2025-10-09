import { getSession } from '@/lib/session';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import Image from 'next/image';

export default async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session) return <p className="text-white/70">Please login to view the order.</p>;
	const { id } = await params;
	await connectToDatabase();
	const order = await Order.findOne({ _id: id, user: session.userId });
	if (!order) return <p>Order not found</p>;
	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold">{order.orderNumber || `Order ${order._id.toString()}`}</h1>
			<p className="text-white/70">Status: {order.status} • Placed on {new Date(order.createdAt).toLocaleString()}</p>
			<div className="space-y-2">
				{order.items.map((it: any, idx: number) => (
					<div key={idx} className="flex items-center justify-between border-b border-white/10 pb-2">
						<div className="flex items-center gap-3">
							<div className="relative w-16 h-20 rounded overflow-hidden">
								<Image src={it.image || 'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=400&auto=format&fit=crop'} alt={it.title} fill className="object-cover" />
							</div>
							<div>
								<p className="text-sm">{it.title}</p>
								<p className="text-xs text-white/70">Qty {it.quantity}</p>
							</div>
						</div>
						<p>₹ {it.price * it.quantity}</p>
					</div>
				))}
			</div>
			<p className="text-right text-lg">Total: ₹ {order.totalAmount}</p>
		</div>
	);
}
