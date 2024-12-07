import { SplashScreen, Stack } from 'expo-router';
import 'react-native-reanimated';
import React, { useEffect } from 'react';

export default function HomeLayout() {
  
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerBackTitleVisible: false }} />
  );
}