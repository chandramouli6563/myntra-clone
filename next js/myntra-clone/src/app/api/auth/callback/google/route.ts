import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { signAuthToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (session?.user?.email) {
      await connectToDatabase();
      const dbUser = await User.findOne({ email: session.user.email });
      
      if (dbUser) {
        const token = signAuthToken({
          userId: dbUser._id.toString(),
          email: dbUser.email,
        });
        
        const response = NextResponse.redirect(new URL('/', req.url));
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        
        return response;
      }
    }
    
    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
