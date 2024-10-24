import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BusinessProvider } from '@/contexts/businessCtx';
import { PropsWithChildren } from 'react';
import StripeProvider from './stripeProvider';
import React from 'react';
import AddressesProvider from './addressesCtx';
import buildProvidersTree from '@/util/ProviderTree';
import { SessionProvider } from './authCtx';
import { OrderProvider } from './orderCtx';

const ProvidersTree = buildProvidersTree([
  [SessionProvider, {}],
  [OrderProvider, {}],
  [BusinessProvider, {}],
  [AddressesProvider, {}],
  [StripeProvider, {}],
]);

export default function ContextProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <ProvidersTree>
        { children }
      </ProvidersTree>
    </ThemeProvider>
  );
}