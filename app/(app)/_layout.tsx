import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useSession } from '@/contexts/authCtx';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { user, isLoading: sessionIsLoading } = useSession();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded && !sessionIsLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded && sessionIsLoading) {
    return null;
  }

  if (!Boolean(user)) {
    SplashScreen.hideAsync();
    return <Redirect href="/sign-in" />
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
