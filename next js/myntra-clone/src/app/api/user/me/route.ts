import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
        const session = await getSession();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        await connectToDatabase();
        const user = await User.findById(session.userId);
        return NextResponse.json({ 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone,
                addresses: user.addresses || [], 
                paymentMethods: user.paymentMethods || [] 
        });
}

