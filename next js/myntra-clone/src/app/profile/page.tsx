import { getSession } from '@/lib/session';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export default async function ProfilePage() {
	const session = await getSession();
	if (!session) return <p className="text-white/70">Please login to view your profile.</p>;
	await connectToDatabase();
	const user = await User.findById(session.userId);
	const addr = user.addresses?.[0];
	return (
		<div className="max-w-xl space-y-4">
			<h1 className="text-2xl font-semibold">My Profile</h1>
			<div className="card p-4">
				<p><span className="text-white/60">Name:</span> {user.name}</p>
				<p><span className="text-white/60">Email:</span> {user.email}</p>
			</div>
			<div className="card p-4">
				<h2 className="font-semibold mb-2">Default Address</h2>
				{addr ? (
					<div className="text-white/80">
						<p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
						<p>{addr.city}, {addr.state} - {addr.zip}</p>
						<p>{addr.phone}</p>
					</div>
				) : (
					<p className="text-white/60">No address saved yet.</p>
				)}
				<a href="/checkout" className="btn btn-outline mt-3 inline-block">Manage in Checkout</a>
			</div>
		</div>
	);
}

