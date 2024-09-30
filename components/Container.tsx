import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView, ThemedViewProps } from "./ThemedView";
import { StyleSheet } from "react-native";

export function Container ({ children, ...otherProps }: PropsWithChildren & ThemedViewProps) {
  return (
    <ThemedView style={styles.mainContainer}>
      <SafeAreaView style={styles.container} {...otherProps}>
        { children }
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});