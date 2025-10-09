'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('wishlist') || '[]';
    const list = JSON.parse(raw) as string[];
    setIds(list);
  }, []);

  useEffect(() => {
    async function load() {
      if (ids.length === 0) {
        setProducts([]);
        return;
      }
      const res = await fetch('/api/products');
      const all = await res.json();
      setProducts(all.filter((p: any) => ids.includes(p._id)));
    }
    load();
  }, [ids]);

  function remove(id: string) {
    const next = ids.filter((x) => x !== id);
    localStorage.setItem('wishlist', JSON.stringify(next));
    setIds(next);
  }

  function moveToCart(product: any) {
    const cartRaw = localStorage.getItem('cart') || '[]';
    const cart = JSON.parse(cartRaw) as Array<any>;
    
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: 1,
        brand: product.brand,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    remove(product._id);
    
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            My Wishlist{' '}
            <span className="text-gray-500 font-normal">
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-64 h-64 mb-6">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
                alt="Empty Wishlist"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Save your favorite items here and make your shopping easier
            </p>
            <Link
              href="/"
              className="px-8 py-3 text-white font-semibold rounded-sm"
              style={{ backgroundColor: '#0B7FB3' }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white group"
              >
                <Link href={`/product/${p._id}`} className="block relative">
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <Image
                      src={
                        p.images?.[0] ||
                        'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'
                      }
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        remove(p._id);
                      }}
                      className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                  </div>
                </Link>

                <div className="p-3">
                  <Link href={`/product/${p._id}`}>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                      {p.brand || 'Brand'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                      {p.title}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-gray-900">
                        ₹{p.price}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{p.originalPrice}
                          </span>
                          <span className="text-xs font-semibold text-orange-500">
                            (
                            {Math.round(
                              ((p.originalPrice - p.price) / p.originalPrice) *
                                100
                            )}
                            % OFF)
                          </span>
                        </>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={() => moveToCart(p)}
                    className="w-full py-2.5 text-sm font-bold text-white rounded-sm transition-colors duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#0B7FB3' }}
                  >
                    MOVE TO BAG
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
