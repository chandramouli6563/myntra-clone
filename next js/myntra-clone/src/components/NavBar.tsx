'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function NavBar() {
        const [loggedIn, setLoggedIn] = useState(false);
        const [cartCount, setCartCount] = useState(0);

        useEffect(() => {
                (async () => {
                        try {
                                const res = await fetch('/api/user/me');
                                if (res.ok) {
                                        setLoggedIn(true);
                                        const user = await res.json();
                                        if (!user.phone && window.location.pathname !== '/complete-profile') {
                                                window.location.href = '/complete-profile';
                                        }
                                } else {
                                        setLoggedIn(false);
                                }
                        } catch {
                                setLoggedIn(false);
                        }
                })();
                const loadCart = () => {
                        try {
                                const raw = localStorage.getItem('cart') || '[]';
                                const list = JSON.parse(raw) as any[];
                                setCartCount(list.reduce((s, i) => s + (i.quantity || 0), 0));
                        } catch { setCartCount(0); }
                };
                loadCart();
                const onStorage = (e: StorageEvent) => { if (e.key === 'cart') loadCart(); };
                window.addEventListener('storage', onStorage);
                return () => window.removeEventListener('storage', onStorage);
        }, []);

        async function logout() {
                await fetch('/api/auth/logout', { method: 'POST' });
                setLoggedIn(false);
                window.location.href = '/';
        }

        return (
                <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                        <Link href="/" className="text-2xl font-bold text-[#0B7FB3] hover:text-[#0B7FB3]/80 transition-colors">
                                                Myntra
                                        </Link>
                                        
                                        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                                                <form action="/search" className="w-full relative">
                                                        <input
                                                                name="q"
                                                                placeholder="Search for products, brands and more"
                                                                className="w-full rounded-full px-6 py-2.5 bg-white/5 border border-white/10 focus:border-[#0B7FB3] focus:outline-none text-white placeholder-white/50 transition-colors"
                                                        />
                                                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                </form>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                                <Link href="/wishlist" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group" aria-label="Wishlist" title="Wishlist">
                                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                        <span className="hidden lg:inline">Wishlist</span>
                                                </Link>
                                                
                                                <Link href="/cart" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group relative" aria-label="Cart" title="Cart">
                                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        {cartCount > 0 && (
                                                                <span className="absolute -top-2 -right-2 bg-[#0B7FB3] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
                                                                        {cartCount}
                                                                </span>
                                                        )}
                                                        <span className="hidden lg:inline">Cart</span>
                                                </Link>
                                                
                                                {loggedIn ? (
                                                        <>
                                                                <Link href="/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                                                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                        <span className="hidden lg:inline">Profile</span>
                                                                </Link>
                                                                <button onClick={logout} className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
                                                                        Logout
                                                                </button>
                                                        </>
                                                ) : (
                                                        <>
                                                                <Link href="/login" className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
                                                                        Login
                                                                </Link>
                                                                <Link href="/signup" className="px-4 py-2 rounded-full bg-[#0B7FB3] text-white hover:bg-[#0B7FB3]/90 transition-colors font-semibold">
                                                                        Signup
                                                                </Link>
                                                        </>
                                                )}
                                        </div>
                                </div>
                        </div>
                </nav>
        );
}
