import Razorpay from 'razorpay';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID as string | undefined;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET as string | undefined;

export const razorpay = (() => {
	if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
		return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
	}
	// Dev fallback: mock minimal API
	return {
		orders: {
			create: async (_opts: any) => ({ id: `order_dev_${Date.now()}` }),
		},
	} as unknown as Razorpay;
})();
