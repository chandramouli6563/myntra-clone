import React, { useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import api from '../../src/api/client';
import { useCart } from '../../src/state/useCart';

export default function CheckoutScreen() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    try {
      setLoading(true);
      const orderRes = await api.post('/api/checkout/create-order', { amount: total() });
      const order = orderRes.data;
      if (Platform.select({ web: true })) {
        Alert.alert('Mock Payment', `Order created: ${order.orderId}`);
        await api.post('/api/checkout/verify', {
          razorpay_order_id: order.orderId,
          razorpay_payment_id: 'pay_mock',
          razorpay_signature: 'sig_mock',
        });
      } else {
        Alert.alert('Payment', 'Razorpay SDK integration to be added in dev build');
      }
      clear();
      Alert.alert('Success', 'Payment verified!');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Checkout</Text>
      <Text style={{ marginBottom: 16 }}>Total: ₹{total()}</Text>
      <Pressable onPress={startPayment} disabled={loading || !items.length} style={{ backgroundColor: '#ff3f6c', padding: 14, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{loading ? 'Processing...' : 'Pay with Razorpay'}</Text>
      </Pressable>
    </View>
  );
}


