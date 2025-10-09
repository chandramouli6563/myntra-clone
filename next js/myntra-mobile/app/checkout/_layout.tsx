import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Checkout', headerShown: true }} />
      <Stack.Screen name="address" options={{ title: 'Address', headerShown: true }} />
    </Stack>
  );
}


