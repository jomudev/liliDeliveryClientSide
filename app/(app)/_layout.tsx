import { Stack } from 'expo-router';
import 'react-native-reanimated';
import React from 'react';
import AuthHandler from '@/components/AuthHandler';

export default function HomeLayout() {

  return (
    <AuthHandler>
      <Stack/>
    </AuthHandler>
  );
}