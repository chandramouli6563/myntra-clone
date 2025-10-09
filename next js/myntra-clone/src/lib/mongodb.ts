import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error('MONGODB_URI environment variable is not set');
}

let cachedConnection: typeof mongoose | null = (global as any).__mongooseConn || null;
let cachedPromise: Promise<typeof mongoose> | null = (global as any).__mongoosePromise || null;

export async function connectToDatabase(): Promise<typeof mongoose> {
	if (cachedConnection) return cachedConnection;
	if (!cachedPromise) {
		cachedPromise = mongoose.connect(MONGODB_URI, { dbName: 'ecommerce' });
		(global as any).__mongoosePromise = cachedPromise;
	}
	cachedConnection = await cachedPromise;
	(global as any).__mongooseConn = cachedConnection;
	return cachedConnection;
}

