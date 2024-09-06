import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";

export default function CenteredText ({children}: { children: string }) {
  return <ThemedText style={styles.text}>{ children }</ThemedText>
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  }
})