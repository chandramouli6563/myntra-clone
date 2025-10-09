'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.phone) {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update phone number');
      }

      router.push('/');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="card p-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#ff3f6c' }}>
          Complete Your Profile
        </h1>
        <p className="text-white/70 mb-6">
          To enable OTP login and complete your account setup, please provide your phone number.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-white/80">Phone Number</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none transition-colors"
              placeholder="Enter your phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-white/60 mt-1">
              This will be used for OTP login and order updates
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            className="w-full py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#ff3f6c', color: 'white' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
