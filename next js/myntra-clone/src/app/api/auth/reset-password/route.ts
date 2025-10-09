import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { resetTokens } from '../forgot-password/route';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      );
    }

    const stored = resetTokens.get(token);

    if (!stored) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    if (stored.expires < Date.now()) {
      resetTokens.delete(token);
      return NextResponse.json(
        { message: 'Reset token has expired' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email: stored.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    resetTokens.delete(token);

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
