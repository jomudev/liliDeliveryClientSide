import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

export default function Button ({ children, style, ...otherProps }: PressableProps) {
  const theme = useColorScheme() ?? 'light';
  return (
    <Pressable style={[styles.button, style, { backgroundColor:  Colors[theme].primary }]} {...otherProps} >{ children }</Pressable>
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