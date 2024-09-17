import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext } from 'react';
import 'react-native-reanimated';
import { AuthContext } from '@/contexts/authCtx';

import { useColorScheme } from '@/hooks/useColorScheme';
import ContextProviders from '@/contexts/ContextProviders';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const { user, isLoading } = useContext(AuthContext);
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
    <ContextProviders>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </ContextProviders>
  );
}
