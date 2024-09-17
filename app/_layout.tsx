import { Slot } from 'expo-router';
import { SessionProvider } from '@/contexts/authCtx';
import { OrderProvider } from '@/contexts/orderCtx';
import OrderBanner from '@/components/OrderBanner';

export default function RootLayout() {
  return (
    <SessionProvider>
      <OrderProvider>
        <Slot />
        <OrderBanner />
      </OrderProvider>
    </SessionProvider>
  );
}