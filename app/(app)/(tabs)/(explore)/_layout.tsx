import { Stack } from 'expo-router';
import 'react-native-reanimated';
import React from 'react';

export default function ExploreLayout() {

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='branchScreen' options={{ headerShown: false }} />
    </Stack>
  );
}