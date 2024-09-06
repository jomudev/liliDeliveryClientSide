import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BusinessProvider } from '@/contexts/businessCtx';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <BusinessProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'business' : 'business-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'My Orders',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'basket' : 'basket-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </BusinessProvider>
  );
}
