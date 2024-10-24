import { Platform, ViewProps, View, StyleSheet } from "react-native";
import { BlurViewProps, BlurView as ExpoBlurView } from "expo-blur";
import React from "react";
export default function BlurView (props: ( (ViewProps & BlurViewProps)) & { tint?: 'light' | 'dark'}) {
  if (Platform.OS === 'ios') return <ExpoBlurView {...props} style={props.style} />;
  if (Platform.OS === 'android') return <ExpoBlurView {...props} style={[props.style]} experimentalBlurMethod="dimezisBlurView"/>
  return <View {...props} style={[styles[props?.tint || 'light']]} />
};

const styles = StyleSheet.create({
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});