import { Stack } from 'expo-router';
import 'react-native-reanimated';
import React from 'react';
import AuthHandler from '@/components/AuthHandler';

export default function HomeLayout() {

  return (
    <AuthHandler>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='addAddress' options={{ headerTitle: 'Add Address', headerBackTitle: 'Back' }} />
        <Stack.Screen name='addComplement' options={{ headerShown: false }} />
        <Stack.Screen name='ordersHistory' options={{ headerBackTitle: 'Back', headerTitle: 'Orders History' }} /> 
      </Stack>
    </AuthHandler>
  );
}