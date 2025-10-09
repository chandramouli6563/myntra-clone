export default function OrderSuccessPage() {
	return (
		<div className="max-w-md mx-auto text-center space-y-3">
			<h1 className="text-2xl font-semibold" style={{ color: '#26a541' }}>Payment Successful</h1>
			<p className="text-white/80">Thank you for your purchase! Your order has been placed.</p>
			<a href="/orders" className="btn btn-primary inline-block">Go to My Orders</a>
		</div>
	);
}

