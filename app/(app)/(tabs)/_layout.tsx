import { Stack, Tabs, usePathname } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }}/>
      <Tabs
      screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="(explore)" 
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'business' : 'business-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(WithAuthOnly)"
          options={{
            title: 'Orders',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'basket' : 'basket-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
