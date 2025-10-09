import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { NavBar } from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
        title: 'Myntra - Fashion & Lifestyle Store',
        description: 'Discover the latest trends in fashion. Shop from thousands of styles curated just for you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
                <html lang="en">
                        <head>
                                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
                        </head>
                        <body className="bg-black text-white">
                                <NavBar />
                                <main>{children}</main>
                                <Footer />
                        </body>
                </html>
        );
}
