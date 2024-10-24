import { TextProps } from "@rneui/base";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import React from "react";

export default function CenteredText ({children, ...props}: { children: string } & TextProps) {
  return <ThemedText style={styles.text} {...props}>{ children }</ThemedText>
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  }
})