import { Slot } from 'expo-router';
import { SessionProvider } from '@/contexts/authCtx';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}