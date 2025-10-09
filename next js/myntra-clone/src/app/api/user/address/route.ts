import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const address = await req.json();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.addresses.push(address);
    await user.save();

    return NextResponse.json({ message: 'Address added', addresses: user.addresses });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { _id, ...addressData } = await req.json();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex((a: any) => a._id.toString() === _id);
    if (addressIndex === -1) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...addressData };
    await user.save();

    return NextResponse.json({ message: 'Address updated', addresses: user.addresses });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Address ID required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.addresses = user.addresses.filter((a: any) => a._id.toString() !== id);
    await user.save();

    return NextResponse.json({ message: 'Address deleted', addresses: user.addresses });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
  }
}
