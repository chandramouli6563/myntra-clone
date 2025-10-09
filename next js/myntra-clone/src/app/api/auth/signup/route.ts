import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
        try {
                await connectToDatabase();
                const { name, email, password, phone } = await req.json();
                if (!name || !email || !password || !phone) {
                        return NextResponse.json({ message: 'All fields are required including phone number' }, { status: 400 });
                }
                const existing = await User.findOne({ email });
                if (existing) {
                        return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
                }
                const phoneExists = await User.findOne({ phone });
                if (phoneExists) {
                        return NextResponse.json({ message: 'Phone number already in use' }, { status: 409 });
                }
                const user = await User.create({ name, email, password, phone });
        const token = signAuthToken({ userId: user._id.toString(), email });
        const response = NextResponse.json({ id: user._id, name: user.name, email: user.email });
        response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
        response.headers.set('x-auth-token', token);
        return response;
        } catch (e: any) {
                return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
        }
}
