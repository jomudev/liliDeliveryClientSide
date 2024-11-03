import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, PressableProps, StyleSheet } from 'react-native';

export default function Button ({ children, style, isLoading,  onPress, ...otherProps }: PressableProps & { isLoading?: boolean }) {
  const theme = useColorScheme() ?? 'light';

  const handlePressButton = () => {
    let pressed = false;
    return async (event: GestureResponderEvent) => {
      if (pressed) return;
      pressed = true;
      onPress && onPress(event);
    }
  }

  return (
    <Pressable 
      onPress={handlePressButton()}
      style={[
        styles.button, 
        style, 
        { 
          backgroundColor:  Colors[theme].primary 
        }
      ]} 
      {...otherProps} 
      >
        { isLoading ? <ActivityIndicator size={32} color={Colors[theme].warning}/> : children }
      </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 24, 
  }
});