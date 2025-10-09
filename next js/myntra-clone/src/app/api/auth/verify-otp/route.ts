import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { signAuthToken } from '@/lib/auth';
import otpStore from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { phone, otp, name } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    const stored = otpStore.get(phone);

    if (!stored) {
      return NextResponse.json({ message: 'OTP not found or expired' }, { status: 400 });
    }

    if (stored.expires < Date.now()) {
      otpStore.delete(phone);
      return NextResponse.json({ message: 'OTP expired' }, { status: 400 });
    }

    if (stored.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    otpStore.delete(phone);

    await connectToDatabase();
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: name || 'User',
        email: `${phone}@phone.local`,
      });
    }

    const token = signAuthToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
