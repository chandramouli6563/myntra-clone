import React from 'react';
import { FlatList, Image, TouchableOpacity, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useWishlist } from '@/src/state/useWishlist';
import { useCart } from '@/src/state/useCart';

export default function WishlistScreen() {
  const { items, remove, refresh } = useWishlist();
  const { add: addToCart } = useCart();
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

  const handleAddToCart = (item: any) => {
    addToCart({
      _id: item._id,
      title: item.title,
      price: item.price,
      images: item.images,
    });
    remove(item._id);
  };

  if (!items.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-6xl mb-4">❤️</Text>
        <Text className="text-2xl font-bold text-secondary mb-2">
          Your Wishlist is Empty
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Save your favorite items here to buy them later
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          className="bg-primary px-8 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Explore Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-secondary">My Wishlist</Text>
        <Text className="text-gray-600 mt-1">{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <View className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden mb-2">
            <TouchableOpacity onPress={() => router.push(`/product/${item._id}`)}>
              {item.images?.[0] ? (
                <Image
                  source={{ uri: item.images[0] }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-48 bg-gray-200" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => remove(item._id)}
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full"
            >
              <Text className="text-base">❤️</Text>
            </TouchableOpacity>

            <View className="p-3">
              <Text numberOfLines={2} className="font-semibold text-secondary mb-2">
                {item.title}
              </Text>
              <Text className="text-lg font-bold text-primary mb-3">₹{item.price}</Text>

              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                className="bg-primary py-2 rounded-lg"
              >
                <Text className="text-white text-center font-semibold text-sm">
                  Move to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
