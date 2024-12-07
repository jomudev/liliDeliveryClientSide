import { Stack } from 'expo-router';
import 'react-native-reanimated';
import React from 'react';
import AuthHandler from '@/components/AuthHandler';

export default function SettingsLayout() {
  return (
    <AuthHandler>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthHandler>
  );
}