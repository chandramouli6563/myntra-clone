import api from './client';

export const productService = {
  async getAllProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  async getProductReviews(id: string) {
    const response = await api.get(`/api/products/${id}/reviews`);
    return response.data;
  },

  async addProductReview(id: string, data: { rating: number; comment: string }) {
    const response = await api.post(`/api/products/${id}/reviews`, data);
    return response.data;
  },

  async getProductRatings(id: string) {
    const response = await api.get(`/api/products/${id}/ratings`);
    return response.data;
  },
};
