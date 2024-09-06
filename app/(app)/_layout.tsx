import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { AuthContext, useSession } from '@/contexts/authCtx';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const { user, isLoading } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  if (isLoading) {
    return null;
  }

  if (!Boolean(user)) {
    SplashScreen.hideAsync();
    return <Redirect href="/sign-in" />
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
