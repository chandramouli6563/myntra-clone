import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  _id: string;
  title: string;
  price: number;
  images: string[];
  quantity: number;
  size?: string;
  brand?: string;
  category?: string;
};

const STORAGE_KEY = 'cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v) setItems(JSON.parse(v));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(item: Omit<CartItem, 'quantity'>, qty = 1) {
    setItems((prev) => {
      const key = `${item._id}_${item.size || 'default'}`;
      const existing = prev.find((p) => `${p._id}_${p.size || 'default'}` === key);
      if (existing) {
        return prev.map((p) => 
          `${p._id}_${p.size || 'default'}` === key 
            ? { ...p, quantity: p.quantity + qty } 
            : p
        );
      }
      return [{ ...item, quantity: qty }, ...prev];
    });
  }

  function increase(id: string, size?: string) {
    setItems((prev) => prev.map((p) => 
      (p._id === id && p.size === size) ? { ...p, quantity: p.quantity + 1 } : p
    ));
  }

  function decrease(id: string, size?: string) {
    setItems((prev) => prev.map((p) => 
      (p._id === id && p.size === size) ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
    ));
  }

  function remove(id: string, size?: string) {
    setItems((prev) => prev.filter((p) => !(p._id === id && p.size === size)));
  }

  function clear() {
    setItems([]);
  }

  function total() {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  function count() {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }

  async function refresh() {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    setItems(v ? JSON.parse(v) : []);
  }

  return { items, add, increase, decrease, remove, clear, total, count, refresh };
}


