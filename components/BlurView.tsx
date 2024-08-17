import { Platform, ViewProps, View, StyleSheet } from "react-native";
import { BlurViewProps, BlurView as ExpoBlurView } from "expo-blur";
export default function BlurView (props: (BlurViewProps | (ViewProps & BlurViewProps)) & { tint: 'light' | 'dark'}) {
  if (Platform.OS === 'ios') return <ExpoBlurView {...props} style={[props.style]} />;
  if (Platform.OS === 'android') return <ExpoBlurView {...props} style={[props.style]} experimentalBlurMethod="dimezisBlurView"/>
  return <View {...props} style={[styles[props.tint]]} />
};

const styles = StyleSheet.create({
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});