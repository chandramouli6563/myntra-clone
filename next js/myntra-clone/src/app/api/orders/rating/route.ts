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

                const { orderId, stars, review } = await req.json();
                
                if (!orderId || !stars) {
                        return NextResponse.json({ message: 'Order ID and rating are required' }, { status: 400 });
                }

                if (stars < 1 || stars > 5) {
                        return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
                }

                await connectToDatabase();
                const order = await Order.findOne({ _id: orderId, user: session.userId });
                
                if (!order) {
                        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
                }

                if (order.status !== 'delivered') {
                        return NextResponse.json({ 
                                message: 'Can only rate delivered orders' 
                        }, { status: 400 });
                }

                order.rating = {
                        stars,
                        review: review || '',
                        createdAt: new Date(),
                };
                await order.save();

                return NextResponse.json({ 
                        message: 'Rating added successfully', 
                        rating: order.rating 
                });
        } catch (error: any) {
                console.error('Add rating error:', error);
                return NextResponse.json({ message: error.message || 'Failed to add rating' }, { status: 500 });
        }
}
