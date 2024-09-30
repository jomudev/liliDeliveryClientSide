import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { OrderProvider } from '@/contexts/orderCtx';
import { BusinessProvider } from '@/contexts/businessCtx';
import { PropsWithChildren } from 'react';
import StripeProvider from './stripeProvider';

export default function ContextProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <BusinessProvider>
        <StripeProvider>
          { children }
        </StripeProvider>
      </BusinessProvider>
    </ThemeProvider>
  );
}