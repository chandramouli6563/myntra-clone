'use client';

import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

const categoryFilters: Record<string, { brands?: string[]; types?: string[] }> = {
  men: {
    brands: ['Nike', 'Puma', 'Adidas', 'H&M', 'Zara', 'Levis', 'Roadster', 'Tommy Hilfiger'],
  },
  women: {
    brands: ['Zara', 'H&M', 'Forever 21', 'Mango', 'Nike', 'Vero Moda'],
  },
  kids: {
    brands: ['GAP Kids', 'Carters', 'H&M Kids', 'Mothercare', 'UCB Kids'],
  },
  footwear: {
    brands: ['Nike', 'Adidas', 'Puma', 'Clarks', 'Steve Madden', 'Bata'],
  },
  accessories: {
    brands: ['Fossil', 'Michael Kors', 'Ray-Ban', 'Titan', 'Fastrack'],
  },
  beauty: {
    types: ['Lipstick', 'Face Wash', 'Serum', 'Kajal', 'Moisturizer', 'Nail Polish', 'Compact Powder', 'Foundation'],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const isSale = searchParams.get('sale') === 'true';
  const filterConfig = categoryFilters[slug] || categoryFilters.men;
  const isBeautyCategory = slug === 'beauty';

  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Navy Blue', 'Pink'];
  const sortOptions = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'new', label: "What's New" },
    { id: 'popular', label: 'Popularity' },
    { id: 'discount', label: 'Better Discount' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'rating', label: 'Customer Rating' },
  ];

  // Calculate consistent discount and originalPrice
  const productsWithDiscounts = useMemo(() => {
    return allProducts.map((product) => {
      let discount = product.discount || 0;
      let originalPrice = product.originalPrice || 0;
      
      // If no discount data, calculate based on product ID hash
      if (!discount || !originalPrice) {
        const hash = product._id ? product._id.charCodeAt(product._id.length - 1) : 0;
        discount = 15 + (hash % 56); // 15-70% discount range
        originalPrice = Math.round(product.price / (1 - discount / 100));
      }
      
      return {
        ...product,
        discount,
        originalPrice,
      };
    });
  }, [allProducts]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter((p: any) => p.category === slug || slug === 'all');
          setAllProducts(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug]);

  useEffect(() => {
    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(wishlist);
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedFilters([]);
    setPriceRange([0, 10000]);
    setSelectedDiscount(0);
  };

  const addToWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(productId)) {
      const updated = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    } else {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    window.dispatchEvent(new Event('storage'));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const filteredProducts = productsWithDiscounts.filter((product) => {
    if (selectedFilters.length > 0) {
      if (isBeautyCategory) {
        if (!selectedFilters.includes(product.type)) return false;
      } else {
        if (!selectedFilters.includes(product.brand)) return false;
      }
    }

    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    if (selectedColors.length > 0) {
      if (!product.colors || !product.colors.some((c: string) => selectedColors.includes(c))) {
        return false;
      }
    }

    if (selectedDiscount > 0) {
      if (product.discount < selectedDiscount) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'discount':
        return b.discount - a.discount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative h-[200px] bg-gradient-to-br from-[#0B7FB3] to-[#0969A0]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {categoryName}
            </h1>
            <p className="text-lg text-white/90">
              {sortedProducts.length} {isSale ? 'Sale Items' : 'Products'}
            </p>
          </motion.div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#0B7FB3] hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {isBeautyCategory ? 'Product Type' : 'Brands'}
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(isBeautyCategory ? filterConfig.types : filterConfig.brands)?.map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(item)}
                          onChange={() => toggleFilter(item)}
                          className="w-4 h-4 rounded border-gray-300 text-[#0B7FB3] focus:ring-[#0B7FB3]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-[#0B7FB3]"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {!isBeautyCategory && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedColors.includes(color)
                              ? 'bg-[#0B7FB3] text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Discount</h3>
                  <div className="space-y-2">
                    {[0, 10, 20, 30, 40, 50, 60, 70].map((discount) => (
                      <label key={discount} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="discount"
                          checked={selectedDiscount === discount}
                          onChange={() => setSelectedDiscount(discount)}
                          className="w-4 h-4 text-[#0B7FB3] focus:ring-[#0B7FB3]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                          {discount === 0 ? 'All' : `${discount}% and above`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 font-medium">
                Showing {sortedProducts.length} products
              </p>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 pr-10 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B7FB3] focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B7FB3]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
                  >
                    <Link href={`/product/${product._id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <Image
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-sm font-bold text-gray-800">{product.brand || 'Brand'}</p>
                        <h3 className="text-sm text-gray-600 line-clamp-1">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-base font-bold text-gray-900">₹{product.price}</span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                          <span className="text-xs text-[#26a541] font-semibold">
                            {product.discount}% OFF
                          </span>
                        </div>
                        {product.rating && (
                          <div className="flex items-center gap-1 pt-1">
                            <span className="text-xs bg-[#26a541] text-white px-2 py-0.5 rounded font-medium">
                              {product.rating} ★
                            </span>
                            <span className="text-xs text-gray-400">({Math.floor(Math.random() * 1000)})</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <button
                      onClick={(e) => addToWishlist(product._id, e)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-10"
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${
                          isInWishlist(product._id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-700 hover:text-red-500'
                        }`}
                        fill={isInWishlist(product._id) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  No products found
                </h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearAllFilters}
                  className="inline-block px-6 py-3 bg-[#0B7FB3] text-white rounded-full hover:bg-[#0969A0] transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
