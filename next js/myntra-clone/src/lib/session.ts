import { cookies } from 'next/headers';
import { headers as getHeaders } from 'next/headers';
import { verifyAuthToken, JwtPayload } from '@/lib/auth';

export async function getSession(): Promise<JwtPayload | null> {
        try {
        // Prefer Authorization Bearer token (for mobile clients), fallback to cookie
        const hdrs = await getHeaders();
        const authHeader = hdrs.get('authorization') || hdrs.get('Authorization');

        let token: string | undefined;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice('Bearer '.length).trim();
        } else {
            token = (await cookies()).get('token')?.value;
        }

        if (!token) return null;
        return verifyAuthToken(token);
        } catch {
                return null;
        }
}

