import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const { email, password } = await req.json();
		if (!email || !password) {
			return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
		}
		const user = await User.findOne({ email }).select('+password');
		if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
		const ok = await user.comparePassword(password);
		if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        const token = signAuthToken({ userId: user._id.toString(), email });
        const response = NextResponse.json({ id: user._id, name: user.name, email: user.email });
        // Web: cookie; Mobile: also expose token via header for RN clients
        response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
        response.headers.set('x-auth-token', token);
        return response;
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}
