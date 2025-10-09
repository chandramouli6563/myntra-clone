import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET environment variable is not set');
}

export interface JwtPayload {
	userId: string;
	email: string;
}

export function signAuthToken(payload: JwtPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

export function verifyAuthToken(token: string): JwtPayload {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

