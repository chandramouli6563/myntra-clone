import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

const resetTokens = new Map<string, { email: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, a reset link will be sent.' },
        { status: 200 }
      );
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const expires = Date.now() + 60 * 60 * 1000;

    resetTokens.set(resetToken, { email, expires });

    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset - Myntra Clone',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({
      message: 'If an account exists, a reset link will be sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export { resetTokens };
