import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BusinessProvider } from '@/contexts/businessCtx';
import { PropsWithChildren } from 'react';
import StripeProvider from './stripeProvider';
import React from 'react';
import AddressesProvider from './addressesCtx';

export default function ContextProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <BusinessProvider>
        <StripeProvider>
          <AddressesProvider>
            { children }
          </AddressesProvider>
        </StripeProvider>
      </BusinessProvider>
    </ThemeProvider>
  );
}