'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

async function fetchProductServer(id: string) {
        const res = await fetch(`/api/products/${id}`);
        return res.json();
}

function formatDelivery(daysFromNow = 4) {
        const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
        return d.toLocaleDateString();
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
        const [product, setProduct] = useState<any>(null);
        const [loading, setLoading] = useState(true);
        const [wish, setWish] = useState(false);
        const [qty, setQty] = useState(1);
        const [reviews, setReviews] = useState<any[]>([]);
        const [orderRatings, setOrderRatings] = useState<any[]>([]);
        const [rating, setRating] = useState(5);
        const [comment, setComment] = useState('');
        const [selectedSize, setSelectedSize] = useState<string>('');

        useEffect(() => {
                (async () => {
                        const { id } = await params;
                        const data = await fetchProductServer(id);
                        setProduct(data);
                        setSelectedSize((data?.sizes && data.sizes[0]) || '');
                        setLoading(false);
                        const wlRaw = localStorage.getItem('wishlist') || '[]';
                        const wl = JSON.parse(wlRaw) as string[];
                        setWish(wl.includes(id));
                        const rv = await fetch(`/api/products/${id}/reviews`);
                        setReviews(await rv.json());
                        const ratingsRes = await fetch(`/api/products/${id}/ratings`);
                        if (ratingsRes.ok) {
                                setOrderRatings(await ratingsRes.json());
                        }
                })();
        }, [params]);

        const averageRating = useMemo(() => {
                if (!reviews.length) return product?.rating || 0;
                const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
                return Math.round(avg * 10) / 10;
        }, [reviews, product]);

        const original = Math.round((product?.price || 0) * 1.25);
        const discount = original > 0 ? Math.max(0, Math.round(((original - (product?.price || 0)) / original) * 100)) : 0;

        function addToCart() {
                if (!product) return;
                if (product?.sizes?.length && !selectedSize) {
                        alert('Please select a size');
                        return;
                }
                const raw = localStorage.getItem('cart') || '[]';
                const cart = JSON.parse(raw) as any[];
                const idx = cart.findIndex((c) => c.productId === product._id && c.size === selectedSize);
                if (idx >= 0) {
                        cart[idx].quantity += qty;
                } else {
                        cart.push({ productId: product._id, title: product.title, price: product.price, image: product.images?.[0] || '', quantity: qty, size: selectedSize, brand: product.brand });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
                alert('Added to cart');
        }

        function toggleWishlist() {
                if (!product) return;
                const raw = localStorage.getItem('wishlist') || '[]';
                const wl = JSON.parse(raw) as string[];
                const id = product._id as string;
                const exists = wl.includes(id);
                const next = exists ? wl.filter((x) => x !== id) : wl.concat(id);
                localStorage.setItem('wishlist', JSON.stringify(next));
                setWish(!exists);
        }

        async function submitReview() {
                if (!product) return;
                const res = await fetch(`/api/products/${product._id}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating, comment }) });
                if (res.ok) {
                        const rv = await fetch(`/api/products/${product._id}/reviews`);
                        setReviews(await rv.json());
                        setComment('');
                        alert('Review submitted');
                } else {
                        alert('Please login to review');
                }
        }

        if (loading) return <p>Loading...</p>;
        if (!product) return <p>Product not found</p>;

        return (
                <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                                        <Image src={product.images?.[0] || 'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'} alt={product.title} fill className="object-cover" />
                                        <button aria-label="Wishlist" title="Wishlist" onClick={toggleWishlist} className="absolute top-3 right-3 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                                                <span style={{ color: wish ? '#0B7FB3' : '#fff' }}>{wish ? '❤️' : '♡'}</span>
                                        </button>
                                </div>
                                <div>
                                        <h1 className="text-2xl font-semibold">{product.title}</h1>
                                        <p className="text-white/70 mt-1 text-sm">{product.brand || 'Brand'} • {product.category}</p>
                                        <p className="mt-2 text-sm">{averageRating} ★ ({reviews.length} reviews)</p>
                                        <p className="mt-3 text-2xl" style={{ color: '#26a541' }}>₹ {product.price}</p>
                                        <p className="text-white/60">
                                                <span className="line-through">₹ {original}</span>
                                                <span className="ml-2" style={{ color: '#26a541' }}>{discount}% OFF</span>
                                                <span className="ml-3 text-sm">Delivery by {formatDelivery(4)}</span>
                                        </p>

                                        {product?.sizes?.length ? (
                                                <div className="mt-4">
                                                        <p className="text-sm text-white/80 mb-2">Select Size</p>
                                                        <div className="flex flex-wrap gap-2">
                                                                {product.sizes.map((s: string) => (
                                                                        <button key={s} type="button" onClick={() => setSelectedSize(s)} className={`px-3 py-1 rounded-md border ${selectedSize === s ? 'bg-[var(--brand)] text-white border-transparent' : 'border-white/20'}`}>
                                                                                {s}
                                                                        </button>
                                                                ))}
                                                        </div>
                                                </div>
                                        ) : null}

                                        <div className="flex items-center gap-3 mt-4">
                                                <label className="text-white/70 text-sm">Qty</label>
                                                <select value={qty} onChange={(e) => setQty(parseInt(e.target.value))} className="bg-neutral-900 border border-white/10 rounded-md px-2 py-1">
                                                        {Array.from({ length: 10 }).map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                </select>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                                <button className="btn btn-primary" onClick={addToCart}>Add to cart</button>
                                        </div>
                                </div>
                        </div>

                        <div className="card p-4">
                                <h2 className="font-semibold mb-3">Ratings & Reviews ({reviews.length + orderRatings.length} total)</h2>
                                <div className="flex items-center gap-2 mb-3">
                                        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="bg-neutral-900 border border-white/10 rounded-md px-2 py-1">
                                                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                                        </select>
                                        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment" className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-white/10" />
                                        <button className="btn btn-primary" onClick={submitReview}>Submit</button>
                                </div>

                                {/* Order Ratings Section */}
                                {orderRatings.length > 0 && (
                                        <div className="mb-6">
                                                <h3 className="text-sm font-semibold text-[#0B7FB3] mb-3">Verified Purchase Reviews</h3>
                                                <div className="space-y-3">
                                                        {orderRatings.map((r: any, idx: number) => (
                                                                <div key={`order-${idx}`} className="bg-neutral-900/50 p-3 rounded-lg border border-[#0B7FB3]/20">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                <div className="flex text-yellow-400">
                                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                                <span key={star} className={star <= r.stars ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                                                                                        ))}
                                                                                </div>
                                                                                <span className="text-xs bg-[#0B7FB3] text-white px-2 py-0.5 rounded-full">Verified</span>
                                                                        </div>
                                                                        {r.review && <p className="text-white/80 text-sm mb-2">{r.review}</p>}
                                                                        <div className="flex items-center justify-between text-xs text-white/50">
                                                                                <span>{r.userName}</span>
                                                                                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                )}

                                {/* Regular Reviews Section */}
                                {reviews.length > 0 && (
                                        <div>
                                                <h3 className="text-sm font-semibold mb-3">Customer Reviews</h3>
                                                <div className="space-y-2">
                                                        {[...reviews].reverse().map((r: any, idx: number) => (
                                                                <div key={idx} className="border-b border-white/10 pb-2">
                                                                        <p className="text-sm">{r.rating} ★</p>
                                                                        <p className="text-white/80 text-sm">{r.comment}</p>
                                                                        <p className="text-white/50 text-xs">{new Date(r.createdAt).toLocaleString()}</p>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                )}

                                {reviews.length === 0 && orderRatings.length === 0 && (
                                        <p className="text-white/70 text-sm text-center py-4">No reviews yet. Be the first to review!</p>
                                )}
                        </div>
                </div>
        );
}
