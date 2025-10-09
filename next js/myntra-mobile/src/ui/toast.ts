import { Alert, Platform, ToastAndroid } from 'react-native';

export function showToast(message: string) {
  if (Platform.OS === 'android') {
    try { ToastAndroid.show(message, ToastAndroid.SHORT); return; } catch {}
  }
  Alert.alert('', message);
}


