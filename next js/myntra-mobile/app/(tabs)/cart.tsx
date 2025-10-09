import React from 'react';
import { FlatList, Image, TouchableOpacity, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCart } from '@/src/state/useCart';

export default function CartScreen() {
  const { items, increase, decrease, remove, total, count, refresh } = useCart();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      (async () => {
        if (active) await refresh();
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  if (!items.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-6xl mb-4">🛒</Text>
        <Text className="text-2xl font-bold text-secondary mb-2">Your Cart is Empty</Text>
        <Text className="text-gray-600 text-center mb-6">
          Add items to your cart to see them here
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          className="bg-primary px-8 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-secondary">My Cart</Text>
        <Text className="text-gray-600 mt-1">{count()} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => `${item._id}_${item.size || 'default'}`}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row mb-4 pb-4 border-b border-gray-200">
            {item.images?.[0] ? (
              <Image
                source={{ uri: item.images[0] }}
                className="w-24 h-32 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-32 bg-gray-200 rounded-lg" />
            )}

            <View className="flex-1 ml-4">
              <Text numberOfLines={2} className="font-semibold text-secondary mb-1">
                {item.title}
              </Text>
              {item.brand && <Text className="text-sm text-gray-500 mb-1">{item.brand}</Text>}
              {item.size && (
                <View className="flex-row items-center mb-2">
                  <Text className="text-xs text-gray-600">Size: </Text>
                  <Text className="text-xs font-semibold text-gray-700">{item.size}</Text>
                </View>
              )}
              <Text className="text-lg font-bold text-primary mb-3">₹{item.price}</Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center bg-gray-100 rounded-lg">
                  <TouchableOpacity
                    onPress={() => decrease(item._id, item.size)}
                    className="px-3 py-1"
                  >
                    <Text className="text-lg font-semibold text-gray-700">-</Text>
                  </TouchableOpacity>
                  <Text className="px-3 font-semibold text-gray-800">{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => increase(item._id, item.size)}
                    className="px-3 py-1"
                  >
                    <Text className="text-lg font-semibold text-gray-700">+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => remove(item._id, item.size)}
                  className="px-3 py-1"
                >
                  <Text className="text-red-500 font-medium">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View className="border-t border-gray-200 p-4 bg-white">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-700">Total Amount:</Text>
          <Text className="text-2xl font-bold text-primary">₹{total()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/checkout')}
          className="bg-primary py-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold text-lg">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
