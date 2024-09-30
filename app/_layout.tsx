import { Slot } from 'expo-router';
import { SessionProvider } from '@/contexts/authCtx';
import { OrderProvider } from '@/contexts/orderCtx';

export default function RootLayout() {
  return (
    <SessionProvider>
      <OrderProvider>
        <Slot />
      </OrderProvider>
    </SessionProvider>
  );
}