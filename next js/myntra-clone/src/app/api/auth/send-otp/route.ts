import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import otpStore from '@/lib/otpStore';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ phone });
    
    if (!user) {
      return NextResponse.json({ message: 'Phone number not registered. Please sign up first.' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    otpStore.set(phone, { otp, expires });

    await client.messages.create({
      body: `Your Myntra Clone login OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
