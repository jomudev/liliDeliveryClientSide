import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useState } from 'react';

export async function setStorageItemAsync(key: string, value: string | null) {
    if (value == null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
}

export function useStorageState<T>(key: string, defaultValue: T) {
  // Public
  const [state, setState] = useState<T>(defaultValue);

  // Get
  React.useEffect(() => {
  (async () => {
    let stringValue = await AsyncStorage.getItem(key);
    if (stringValue != null) {
      let value = JSON.parse(stringValue); 
      setState(value);
    }
  })()
  }, [key]);

  // Set
  const setValue = (value: T) => {
    setState(value);
    setStorageItemAsync(key, JSON.stringify(value));
  };

  return [state, setValue];
}
