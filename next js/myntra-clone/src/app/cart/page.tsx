'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  brand?: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  function load() {
    const raw = localStorage.getItem('cart') || '[]';
    setItems(JSON.parse(raw));
  }

  useEffect(() => {
    load();
  }, []);

  function setAndSave(next: CartItem[]) {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  function inc(id: string) {
    const next = items.map((i) => (i.productId === id ? { ...i, quantity: i.quantity + 1 } : i));
    setAndSave(next);
  }

  function dec(id: string) {
    const next = items
      .map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
      .filter((i) => i.quantity > 0);
    setAndSave(next);
  }

  function removeItem(id: string) {
    setAndSave(items.filter((i) => i.productId !== id));
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = Math.round(subtotal * 0.15);
  const deliveryFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal - discount + deliveryFee;

  async function checkout() {
    router.push('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <Image
              src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop"
              alt="Empty bag"
              fill
              className="object-contain opacity-50"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Hey, it feels so light!</h2>
          <p className="text-white/60 mb-8">There is nothing in your bag. Let's add some items.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#0B7FB3] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#0B7FB3]/90 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Shopping Bag</h1>
              <p className="text-white/60 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex gap-4">
                    <div className="relative w-28 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1520975422284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-white/60 mb-1">{item.brand || 'Brand'}</p>
                          <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                          {item.size && (
                            <p className="text-sm text-white/60 mb-2">Size: {item.size}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-white/40 hover:text-red-500 transition-colors h-6"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white/10 rounded-full px-3 py-1">
                          <button
                            onClick={() => dec(item.productId)}
                            className="text-white/60 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => inc(item.productId)}
                            className="text-white/60 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-white">₹{item.price * item.quantity}</p>
                          <p className="text-sm text-white/40 line-through">₹{Math.round(item.price * item.quantity * 1.4)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-6">Price Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>Total MRP</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#26a541]">
                  <span>Discount on MRP</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-[#26a541]' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold text-white">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={checkout}
                className="w-full bg-[#0B7FB3] hover:bg-[#0B7FB3]/90 text-white py-3 rounded-lg font-semibold transition-colors mb-4"
              >
                Place Order
              </button>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 mb-3">We Accept:</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'Amex', 'UPI', 'Paytm', 'COD'].map((method) => (
                    <div key={method} className="bg-white/10 px-3 py-1 rounded text-xs text-white/60">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
