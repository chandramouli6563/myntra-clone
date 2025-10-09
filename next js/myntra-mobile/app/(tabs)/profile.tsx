import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { userService } from '@/src/api/user.service';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data.user || data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-6xl mb-4">👤</Text>
        <Text className="text-2xl font-bold text-secondary mb-2">Welcome!</Text>
        <Text className="text-gray-600 text-center mb-6">
          Login to access your profile and orders
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="bg-primary px-8 py-3 rounded-lg mb-3"
        >
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/signup')}
          className="px-8 py-3"
        >
          <Text className="text-primary font-semibold">Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 bg-primary">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-white rounded-full items-center justify-center mr-4">
            <Text className="text-2xl font-bold text-primary">
              {user.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">{user.name}</Text>
            <Text className="text-white/90">{user.email}</Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-lg font-bold text-secondary mb-4">Account</Text>

        <TouchableOpacity
          onPress={() => router.push('/orders')}
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-2"
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">📦</Text>
            <Text className="font-semibold text-secondary">My Orders</Text>
          </View>
          <Text className="text-gray-400">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-2"
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">📍</Text>
            <Text className="font-semibold text-secondary">Saved Addresses</Text>
          </View>
          <Text className="text-gray-400">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-6"
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">💳</Text>
            <Text className="font-semibold text-secondary">Payment Methods</Text>
          </View>
          <Text className="text-gray-400">→</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-secondary mb-4">Settings</Text>

        <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-2">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🔔</Text>
            <Text className="font-semibold text-secondary">Notifications</Text>
          </View>
          <Text className="text-gray-400">→</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-2">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🔒</Text>
            <Text className="font-semibold text-secondary">Privacy & Security</Text>
          </View>
          <Text className="text-gray-400">→</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">❓</Text>
            <Text className="font-semibold text-secondary">Help & Support</Text>
          </View>
          <Text className="text-gray-400">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
