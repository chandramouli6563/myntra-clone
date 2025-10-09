import api from './client';

export const orderService = {
  async createOrder(data: {
    items: Array<{ productId: string; quantity: number; size: string; price: number }>;
    shippingAddress: any;
    paymentMethod: string;
    totalAmount: number;
  }) {
    const response = await api.post('/api/checkout/create-order', data);
    return response.data;
  },

  async verifyPayment(data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) {
    const response = await api.post('/api/checkout/verify', data);
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/api/orders');
    return response.data;
  },

  async getOrderById(id: string) {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  async trackOrder(orderId: string) {
    const response = await api.post('/api/orders/track', { orderId });
    return response.data;
  },

  async cancelOrder(orderId: string, reason: string) {
    const response = await api.post('/api/orders/cancel', { orderId, reason });
    return response.data;
  },

  async rateOrder(orderId: string, rating: number, comment?: string) {
    const response = await api.post('/api/orders/rating', { orderId, rating, comment });
    return response.data;
  },
};
