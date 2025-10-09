import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WishlistItem = {
  _id: string;
  title: string;
  price: number;
  images: string[];
};

const STORAGE_KEY = 'wishlist';

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v) setItems(JSON.parse(v));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(item: WishlistItem) {
    setItems((prev) => (prev.find((p) => p._id === item._id) ? prev : [item, ...prev]));
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p._id !== id));
  }
  async function refresh() {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    setItems(v ? JSON.parse(v) : []);
  }

  return { items, add, remove, refresh };
}


