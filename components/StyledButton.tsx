import { PressableProps, Pressable, StyleSheet, useColorScheme} from "react-native"; 
import React from "react";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

export type StyledButtonProps = PressableProps;

export default function StyledButton({ children, ...props }: StyledButtonProps) {
  const theme = useColorScheme() || 'light';
  return (
    <Pressable style={[styles.container, {
      backgroundColor: props.backgroundColor || Colors[theme].text,
    }, props.style]} { ...props }>
      { typeof children == 'string' ? (
        <ThemedText type='defaultSemiBold' darkColor="black" lightColor="white">{ children }</ThemedText>
        ) 
        : children 
      }
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});