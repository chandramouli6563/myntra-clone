import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await context.params;
    
    await connectToDatabase();
    
    // Find all delivered orders that contain this product and have ratings
    const orders = await Order.find({
      'items.product': productId,
      status: 'delivered',
      'rating.stars': { $exists: true }
    }).populate('user', 'name').sort({ 'rating.createdAt': -1 });

    // Extract ratings
    const ratings = orders
      .filter(order => order.rating)
      .map(order => ({
        stars: order.rating!.stars,
        review: order.rating!.review || '',
        createdAt: order.rating!.createdAt,
        userName: (order as any).user?.name || 'Anonymous User',
      }));

    return NextResponse.json(ratings);
  } catch (error: any) {
    console.error('Fetch ratings error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch ratings' }, { status: 500 });
  }
}
