import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (res.ok && data.accessToken) {
      await AsyncStorage.setItem('accessToken', data.accessToken);
      console.log('✅ Access token refreshed');
      return data.accessToken;
    } else {
      console.warn('❌ Refresh failed:', data.message);
      return null;
    }
  } catch (err) {
    console.error('Error refreshing access token:', err);
    return null;
  }
};

export const logout = async (navigation) => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (refreshToken) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }

    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    console.log('✅ Logged out');
  } catch (err) {
    console.error('Logout error:', err);
  }
};
