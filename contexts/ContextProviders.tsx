import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { OrderProvider } from '@/contexts/orderCtx';
import { BusinessProvider } from '@/contexts/businessCtx';
import { PropsWithChildren } from 'react';

export default function ContextProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <BusinessProvider>
        { children }
      </BusinessProvider>
    </ThemeProvider>
  );
}