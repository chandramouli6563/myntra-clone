'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
        const searchParams = useSearchParams();
        const router = useRouter();
        const [token, setToken] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [error, setError] = useState('');

        useEffect(() => {
                const tokenParam = searchParams.get('token');
                if (!tokenParam) {
                        setError('Invalid reset link');
                } else {
                        setToken(tokenParam);
                }
        }, [searchParams]);

        async function handleSubmit(e: React.FormEvent) {
                e.preventDefault();
                setLoading(true);
                setError('');

                if (password !== confirmPassword) {
                        setError('Passwords do not match');
                        setLoading(false);
                        return;
                }

                if (password.length < 6) {
                        setError('Password must be at least 6 characters');
                        setLoading(false);
                        return;
                }

                try {
                        const res = await fetch('/api/auth/reset-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token, password }),
                        });

                        if (!res.ok) throw new Error((await res.json()).message);

                        setSuccess(true);
                        setTimeout(() => router.push('/login'), 2000);
                } catch (e: any) {
                        setError(e.message || 'Failed to reset password');
                } finally {
                        setLoading(false);
                }
        }

        if (!token && !error) {
                return (
                        <div className="max-w-md mx-auto text-center">
                                <p className="text-white/70">Loading...</p>
                        </div>
                );
        }

        return (
                <div className="max-w-md mx-auto">
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0B7FB3' }}>
                                Reset Password
                        </h1>
                        <p className="text-white/70 mb-6">Enter your new password below.</p>

                        {success ? (
                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
                                        <p className="text-green-400">
                                                Password reset successful! Redirecting to login...
                                        </p>
                                </div>
                        ) : null}

                        {!success && token ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                                <label className="block text-sm mb-1 text-white/80">New Password</label>
                                                <input
                                                        className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none transition-colors"
                                                        placeholder="Enter new password"
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                />
                                        </div>

                                        <div>
                                                <label className="block text-sm mb-1 text-white/80">Confirm Password</label>
                                                <input
                                                        className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none transition-colors"
                                                        placeholder="Confirm new password"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                />
                                        </div>

                                        {error && <p className="text-red-400 text-sm">{error}</p>}

                                        <button
                                                className="w-full py-3 rounded-lg font-semibold transition-colors"
                                                style={{ backgroundColor: '#0B7FB3', color: 'white' }}
                                                disabled={loading}
                                        >
                                                {loading ? 'Resetting...' : 'Reset Password'}
                                        </button>
                                </form>
                        ) : error ? (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                                        <p className="text-red-400">{error}</p>
                                        <Link href="/forgot-password" className="text-sm mt-2 inline-block hover:underline" style={{ color: '#0B7FB3' }}>
                                                Request a new reset link
                                        </Link>
                                </div>
                        ) : null}

                        <div className="mt-6 text-center">
                                <Link href="/login" className="text-sm hover:underline" style={{ color: '#0B7FB3' }}>
                                        Back to Login
                                </Link>
                        </div>
                </div>
        );
}
