import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const BRANDS = ['Roadster', 'H&M', 'HRX', 'Here&Now', 'Levis', 'Lee'];
const CATEGORIES = ['Men', 'Women', 'Kids'];
const SIZES = ['XS','S','M','L','XL','XXL'];
const COLORS = ['Black','White','Blue','Red','Green','Yellow'];

export async function POST() {
	await connectToDatabase();
	const sample = Array.from({ length: 30 }).map((_, i) => {
		const category = CATEGORIES[i % CATEGORIES.length];
		const brand = BRANDS[i % BRANDS.length];
		const sizes = SIZES.filter((_s, idx) => (i + idx) % 2 === 0); // variety
		const colors = COLORS.filter((_c, idx) => (i + idx) % 2 === 1);
		const rating = Math.round(((3 + (i % 3)) + Math.random()) * 10) / 10; // 3-5 range
		return {
			title: `${brand} Tee ${i + 1}`,
			description: 'Soft cotton, stylish fit for daily wear.',
			price: 399 + (i % 10) * 50,
			images: [
				'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=1200&auto=format&fit=crop',
			],
			category,
			brand,
			rating,
			sizes,
			colors,
		};
	});
	await Product.deleteMany({});
	await Product.insertMany(sample);
	return NextResponse.json({ inserted: sample.length });
}
