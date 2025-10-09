import api from './client';

export const userService = {
  async getProfile() {
    const response = await api.get('/api/user/me');
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }) {
    const response = await api.put('/api/user/update', data);
    return response.data;
  },

  async getAddresses() {
    const response = await api.get('/api/user/address');
    return response.data;
  },

  async addAddress(data: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    type?: string;
  }) {
    const response = await api.post('/api/user/address', data);
    return response.data;
  },

  async updateAddress(addressData: any) {
    const response = await api.put('/api/user/address', addressData);
    return response.data;
  },

  async deleteAddress(id: string) {
    const response = await api.delete('/api/user/address', {
      params: { id }
    });
    return response.data;
  },

  async getPaymentMethods() {
    const response = await api.get('/api/user/payment');
    return response.data;
  },

  async addPaymentMethod(data: any) {
    const response = await api.post('/api/user/payment', data);
    return response.data;
  },

  async deletePaymentMethod(id: string) {
    const response = await api.delete('/api/user/payment', {
      params: { id }
    });
    return response.data;
  },
};
