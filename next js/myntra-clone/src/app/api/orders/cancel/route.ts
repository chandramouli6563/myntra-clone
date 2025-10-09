import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
        try {
                const session = await getSession(req);
                if (!session) {
                        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
                }

                const { orderId, reason } = await req.json();
                
                if (!orderId || !reason) {
                        return NextResponse.json({ message: 'Order ID and reason are required' }, { status: 400 });
                }

                await connectToDatabase();
                const order = await Order.findOne({ _id: orderId, user: session.userId });
                
                if (!order) {
                        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
                }

                if (order.status === 'delivered' || order.status === 'cancelled') {
                        return NextResponse.json({ 
                                message: `Cannot cancel ${order.status} order` 
                        }, { status: 400 });
                }

                order.status = 'cancelled';
                order.cancellationReason = reason;
                await order.save();

                return NextResponse.json({ 
                        message: 'Order cancelled successfully', 
                        order 
                });
        } catch (error: any) {
                console.error('Cancel order error:', error);
                return NextResponse.json({ message: error.message || 'Failed to cancel order' }, { status: 500 });
        }
}
