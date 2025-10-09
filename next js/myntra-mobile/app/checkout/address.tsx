import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import api from '../../src/api/client';
import { router } from 'expo-router';

export default function AddressScreen() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/user/me').then((r) => {
      const last = (r.data?.addresses || [])[0];
      if (last) setAddress(last);
    }).catch(() => {});
  }, []);

  const save = async () => {
    try {
      setLoading(true);
      await api.post('/api/user/address', { address });
      router.replace('/checkout');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Delivery Address</Text>
      <TextInput
        placeholder="House no, Street, City, Pincode"
        multiline
        value={address}
        onChangeText={setAddress}
        style={{ minHeight: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, textAlignVertical: 'top' }}
      />
      <Pressable onPress={save} disabled={loading || !address.trim()} style={{ marginTop: 16, backgroundColor: '#ff3f6c', padding: 14, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{loading ? 'Saving...' : 'Continue to Payment'}</Text>
      </Pressable>
    </ScrollView>
  );
}


