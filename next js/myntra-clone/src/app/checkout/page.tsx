'use client';

import { useEffect, useState } from 'react';
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

export default function CheckoutPage() {
  const router = useRouter();
  const [addr, setAddr] = useState({ line1: '', line2: '', city: '', state: '', zip: '', phone: '' });
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetch('/api/user/me');
        if (me.ok) {
          const data = await me.json();
          if (data.addresses?.[0]) setAddr(data.addresses[0]);
        }
      } catch {}
      
      const raw = localStorage.getItem('cart') || '[]';
      const cartData = JSON.parse(raw) as CartItem[];
      setCart(cartData);
      const totalAmount = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(totalAmount);
    })();
  }, []);

  async function saveAddress() {
    try {
      await fetch('/api/user/address', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(addr) 
      });
      alert('Address saved successfully');
    } catch (error) {
      alert('Failed to save address');
    }
  }

  async function payNow() {
    if (!cart.length) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const me = await fetch('/api/user/me');
      if (!me.ok) {
        alert('Please login to continue');
        router.push('/login');
        return;
      }

      const user = await me.json();

      const items = cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: total,
          userId: user._id || user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY as string;

      if (!key) {
        alert('Razorpay key not configured');
        setLoading(false);
        return;
      }

      // @ts-ignore
      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      const options = {
        key: key,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Myntra',
        description: 'Order Payment',
        order_id: data.razorOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            if (verifyRes.ok) {
              localStorage.removeItem('cart');
              window.dispatchEvent(new Event('storage'));
              router.push('/orders');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            alert('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: addr.phone || user.phone || '',
        },
        theme: {
          color: '#0B7FB3',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Delivery Address</h2>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#0B7FB3] transition-colors"
                placeholder="Address line 1"
                value={addr.line1}
                onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
              />
              <input
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#0B7FB3] transition-colors"
                placeholder="Address line 2"
                value={addr.line2}
                onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#0B7FB3] transition-colors"
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                />
                <input
                  className="px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#0B7FB3] transition-colors"
                  placeholder="State"
                  value={addr.state}
                  onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                />
                <input
                  className="px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#0B7FB3] transition-colors"
                  placeholder="ZIP"
                  value={addr.zip}
                  onChange={(e) => setAddr({ ...addr, zip: e.target.value })}
                />
              </div>
              <input
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#0B7FB3] transition-colors"
                placeholder="Phone"
                value={addr.phone}
                onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-2 text-white/80">
              <div className="flex justify-between">
                <span>Items ({cart.length})</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2 mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 px-6 py-3 rounded-lg border border-[#0B7FB3] text-[#0B7FB3] font-semibold hover:bg-[#0B7FB3]/10 transition-colors"
              onClick={saveAddress}
            >
              Save Address
            </button>
            <button
              className="flex-1 px-6 py-3 rounded-lg bg-[#0B7FB3] text-white font-semibold hover:bg-[#0969A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={payNow}
              disabled={loading || !cart.length}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
