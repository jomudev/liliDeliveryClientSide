import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, StyleSheet,  View } from "react-native";

export default function LoadingIndicator () {
  const theme = useColorScheme() ?? 'light';
  return (
    <View style={styles.loadingModal}>
      <ActivityIndicator size={32} color={theme == 'light' ? '#A984D9' : '#FFE37E'} />
    </View>
  )
};
const styles = StyleSheet.create({
  loadingModal: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.dark.background,
  },
});