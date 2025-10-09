'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
        const [email, setEmail] = useState('');
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [error, setError] = useState('');

        async function handleSubmit(e: React.FormEvent) {
                e.preventDefault();
                setLoading(true);
                setError('');
                setSuccess(false);

                try {
                        const res = await fetch('/api/auth/forgot-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email }),
                        });

                        if (!res.ok) throw new Error((await res.json()).message);

                        setSuccess(true);
                        setEmail('');
                } catch (e: any) {
                        setError(e.message || 'Failed to send reset email');
                } finally {
                        setLoading(false);
                }
        }

        return (
                <div className="max-w-md mx-auto">
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0B7FB3' }}>
                                Forgot Password?
                        </h1>
                        <p className="text-white/70 mb-6">
                                Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {success ? (
                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
                                        <p className="text-green-400">
                                                If an account exists with that email, we've sent a password reset link. Please check your inbox.
                                        </p>
                                </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                        <label className="block text-sm mb-1 text-white/80">Email Address</label>
                                        <input
                                                className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none transition-colors"
                                                placeholder="Enter your email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                        />
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                <button
                                        className="w-full py-3 rounded-lg font-semibold transition-colors"
                                        style={{ backgroundColor: '#0B7FB3', color: 'white' }}
                                        disabled={loading}
                                >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                        </form>

                        <div className="mt-6 text-center">
                                <Link href="/login" className="text-sm hover:underline" style={{ color: '#0B7FB3' }}>
                                        Back to Login
                                </Link>
                        </div>
                </div>
        );
}
