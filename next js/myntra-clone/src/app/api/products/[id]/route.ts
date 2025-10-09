import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(
	_req: NextRequest,
	ctx: { params: Promise<{ id: string }> }
) {
	await connectToDatabase();
	const { id } = await ctx.params;
	const product = await Product.findById(id);
	if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
	return NextResponse.json(product);
}
