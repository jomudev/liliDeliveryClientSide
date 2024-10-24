import { Slot } from 'expo-router';
import React from 'react';
import ContextProviders from '@/contexts/ContextProviders';

export default function RootLayout() {
  return (
    <ContextProviders>
      <Slot />
    </ContextProviders>
  );
}