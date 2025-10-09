import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { getSession } from '@/lib/session';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
	await connectToDatabase();
	const { id } = await ctx.params;
	const product = await Product.findById(id);
	if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
	return NextResponse.json(product.reviews || []);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	await connectToDatabase();
	const { id } = await ctx.params;
	const body = await req.json();
	const rating = Number(body.rating);
	const comment = body.comment || '';
	if (!rating || Number.isNaN(rating)) return NextResponse.json({ message: 'Rating required' }, { status: 400 });
	const product = await Product.findById(id);
	if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
	if (!product.reviews) product.reviews = [] as any;
	(product.reviews as any).push({ user: session.userId as any, rating, comment, createdAt: new Date() });
	const avg = (product.reviews as any).reduce((s: number, r: any) => s + r.rating, 0) / (product.reviews as any).length;
	product.rating = Math.round(avg * 10) / 10;
	await product.save();
	return NextResponse.json({ ok: true }, { status: 201 });
}
