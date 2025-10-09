import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET() {
	await connectToDatabase();
	const products = await Product.find({}).limit(60).sort({ createdAt: -1 });
	return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
	await connectToDatabase();
	const data = await req.json();
	const product = await Product.create(data);
	return NextResponse.json(product, { status: 201 });
}

