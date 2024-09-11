import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";

export default function LoadingIndicator () {
  const theme = useColorScheme() ?? 'light';
  return (
    <ThemedView style={[styles.loadingModal]}>
      <ActivityIndicator size={32} color={theme == 'light' ? '#A984D9' : '#FFE37E'} />
    </ThemedView>
  )
};
const styles = StyleSheet.create({
  loadingModal: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});