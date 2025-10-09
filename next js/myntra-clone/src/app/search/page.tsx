'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

async function fetchAllProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [all, setAll] = useState<any[]>([]);
  
  useEffect(() => {
    fetchAllProducts().then(setAll);
  }, []);
  
  const products = useMemo(() => {
    const t = q.toLowerCase();
    return all.filter((p) =>
      [p.title, p.description, p.category, p.brand]
        .filter(Boolean)
        .some((x: string) => x.toLowerCase().includes(t))
    );
  }, [all, q]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Search Results
            {q && (
              <span className="text-gray-500 font-normal ml-2">
                for "{q}"
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-64 h-64 mb-6">
              <Image
                src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop"
                alt="No results"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No products found
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {q
                ? `We couldn't find any products matching "${q}". Try a different search term.`
                : 'Start searching to find products'}
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-[#0B7FB3] text-white font-semibold rounded-sm hover:bg-[#0969A0] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p: any) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white group"
              >
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
                  {p.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {p.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {p.brand || 'Brand'}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {p.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">
                      ₹{p.price}
                    </span>
                    {p.discount > 0 && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{Math.round(p.price / (1 - p.discount / 100))}
                        </span>
                        <span className="text-xs text-[#26a541] font-semibold">
                          ({p.discount}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                  {p.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center bg-[#26a541] text-white text-xs px-1.5 py-0.5 rounded">
                        <span className="font-semibold">{p.rating}</span>
                        <span className="ml-0.5">★</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
