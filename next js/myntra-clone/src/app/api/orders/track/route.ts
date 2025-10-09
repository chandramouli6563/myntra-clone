import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
        try {
                const session = await getSession(req);
                if (!session) {
                        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
                }

                const { searchParams } = new URL(req.url);
                const orderId = searchParams.get('orderId');

                if (!orderId) {
                        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
                }

                await connectToDatabase();
                const order = await Order.findOne({ _id: orderId, user: session.userId });

                if (!order) {
                        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
                }

                // Auto-update tracking based on days elapsed (dummy for testing)
                const daysSinceOrder = Math.floor(
                        (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                );

                // Update tracking status based on days
                if (order.status === 'processing' || order.status === 'shipped') {
                        const trackingUpdates: any[] = [
                                {
                                        stage: 'processing',
                                        message: 'Order confirmed and being processed',
                                        updatedAt: order.createdAt,
                                }
                        ];

                        if (daysSinceOrder >= 1) {
                                trackingUpdates.push({
                                        stage: 'shipped',
                                        message: 'Order has been shipped',
                                        updatedAt: new Date(new Date(order.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000),
                                });
                        }

                        if (daysSinceOrder >= 3) {
                                trackingUpdates.push({
                                        stage: 'in_transit',
                                        message: 'Package is in transit to your location',
                                        updatedAt: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000),
                                });
                        }

                        if (daysSinceOrder >= 5) {
                                trackingUpdates.push({
                                        stage: 'out_for_delivery',
                                        message: 'Out for delivery',
                                        updatedAt: new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000),
                                });
                        }

                        if (daysSinceOrder >= 7) {
                                trackingUpdates.push({
                                        stage: 'delivered',
                                        message: 'Delivered successfully',
                                        updatedAt: order.deliveryDate || new Date(),
                                });
                                order.status = 'delivered';
                        } else if (daysSinceOrder >= 1) {
                                order.status = 'shipped';
                        }

                        order.trackingStatus = trackingUpdates;
                        await order.save();
                }

                return NextResponse.json({ 
                        order,
                        tracking: order.trackingStatus || []
                });
        } catch (error: any) {
                console.error('Track order error:', error);
                return NextResponse.json({ message: error.message || 'Failed to track order' }, { status: 500 });
        }
}
