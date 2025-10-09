'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

async function fetchProductsClient() {
	const res = await fetch('/api/products');
	return res.json();
}

function formatDelivery(daysFromNow = 4) {
	const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
	return d.toLocaleDateString();
}

export default function CategoriesPage() {
	const searchParams = useSearchParams();
	const initialCategory = searchParams.get('c') || '';
	const [products, setProducts] = useState<any[]>([]);
	const [wishlist, setWishlist] = useState<string[]>([]);
	const [category, setCategory] = useState<string>(initialCategory);
	const [sort, setSort] = useState<string>('');
	const [size, setSize] = useState<string>('');
	const [color, setColor] = useState<string>('');
	const [minRating, setMinRating] = useState<number>(0);

	useEffect(() => { fetchProductsClient().then(setProducts); }, []);
	useEffect(() => { const raw = localStorage.getItem('wishlist') || '[]'; setWishlist(JSON.parse(raw)); }, []);

	const filtered = useMemo(() => {
		let list = [...products];
		if (category) list = list.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());
		if (size) list = list.filter((p) => (p.sizes || []).includes(size));
		if (color) list = list.filter((p) => (p.colors || []).includes(color));
		if (minRating) list = list.filter((p) => (p.rating || 0) >= minRating);
		if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
		if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
		if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		if (sort === 'oldest') list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
		return list;
	}, [products, category, sort, size, color, minRating]);

	function resetFilters() { setCategory(initialCategory); setSort(''); setSize(''); setColor(''); setMinRating(0); }
	function toggleWish(e: React.MouseEvent, id: string) {
		e.preventDefault();
		const exists = wishlist.includes(id);
		const next = exists ? wishlist.filter((x) => x !== id) : wishlist.concat(id);
		localStorage.setItem('wishlist', JSON.stringify(next));
		setWishlist(next);
	}
	function addToCart(e: React.MouseEvent, p: any) {
		e.preventDefault();
		const raw = localStorage.getItem('cart') || '[]';
		const cart = JSON.parse(raw) as any[];
		const idx = cart.findIndex((c) => c.productId === p._id && (!c.size));
		if (idx >= 0) { cart[idx].quantity += 1; } else { cart.push({ productId: p._id, title: p.title, price: p.price, image: p.images?.[0] || '', quantity: 1 }); }
		localStorage.setItem('cart', JSON.stringify(cart));
		window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
	}

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-semibold">{initialCategory ? `${initialCategory} Category` : 'Categories'}</h1>
			<section className="grid grid-cols-1 md:grid-cols-12 gap-6">
				<aside className="md:col-span-3 card p-4 h-fit sticky top-20">
					<h3 className="font-semibold mb-3">Filters</h3>
					<label className="text-sm text-white/80">Category</label>
					<select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-md px-2 py-2 mb-3">
						<option value="">All</option>
						<option>Men</option>
						<option>Women</option>
						<option>Kids</option>
					</select>
					<label className="text-sm text-white/80">Size</label>
					<select value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-md px-2 py-2 mb-3">
						<option value="">All</option>
						{['XS','S','M','L','XL','XXL'].map((s) => <option key={s}>{s}</option>)}
					</select>
					<label className="text-sm text-white/80">Color</label>
					<select value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-md px-2 py-2 mb-3">
						<option value="">All</option>
						{['Black','White','Blue','Red','Green','Yellow'].map((c) => <option key={c}>{c}</option>)}
					</select>
					<label className="text-sm text-white/80">Minimum Rating</label>
					<select value={minRating} onChange={(e) => setMinRating(parseInt(e.target.value))} className="w-full bg-neutral-900 border border-white/10 rounded-md px-2 py-2 mb-3">
						{[0,1,2,3,4,5].map((r) => <option key={r} value={r}>{r}+</option>)}
					</select>
					<label className="text-sm text-white/80">Sort by</label>
					<select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-md px-2 py-2 mb-3">
						<option value="">Featured</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>
					<button className="btn btn-outline w-full" onClick={resetFilters}>Reset</button>
				</aside>
				<div className="md:col-span-9">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{filtered.map((p: any) => {
							const original = Math.round(p.price * 1.25);
							const discount = Math.max(0, Math.round(((original - p.price) / original) * 100));
							return (
								<Link key={p._id} href={`/product/${p._id}`} className="card overflow-hidden group relative">
									<div className="relative aspect-[3/4]">
										<Image src={p.images?.[0] || 'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform" />
										<button aria-label="Wishlist" title="Wishlist" onClick={(e) => toggleWish(e, p._id)} className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded-full">
											<span style={{ color: wishlist.includes(p._id) ? '#ff3f6c' : '#fff' }}>{wishlist.includes(p._id) ? '❤️' : '♡'}</span>
										</button>
									</div>
									<div className="p-3 space-y-1">
										<p className="text-sm text-white/80 line-clamp-1">{p.brand || 'Brand'}</p>
										<p className="font-medium line-clamp-2">{p.title}</p>
										<p className="text-xs text-white/70">{p.rating || 0} ★ • Delivery by {formatDelivery(4)}</p>
										<p>
											<span className="text-lg" style={{ color: '#26a541' }}>₹ {p.price}</span>
											<span className="text-white/50 line-through ml-2">₹ {original}</span>
											<span className="ml-2 text-xs" style={{ color: '#26a541' }}>{discount}% OFF</span>
										</p>
										<div className="flex gap-2 pt-2">
											<button className="btn btn-primary" onClick={(e) => addToCart(e, p)}>Add to cart</button>
											<Link href={`/product/${p._id}`} className="btn btn-outline">View details</Link>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
}
