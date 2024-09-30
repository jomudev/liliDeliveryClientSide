import StyledLink, { StyledLinkStyles } from "@/components/StyledLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import useAddresses, { TAddress } from "@/hooks/useAddresses";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressesScreen () {
  const { addresses } = useAddresses();
  console.log('addresses', addresses)
  const theme = useColorScheme();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>

        {
          addresses.map((address: TAddress) => (
            <ThemedText>
              {
                address.name
              }
            </ThemedText>
          ))
        }
        <StyledLink href={'/(app)/addAddress'}>
          <Ionicons name={'map'} size={16} color={Colors[theme].text} />
          <ThemedText type="defaultSemiBold" > Add Address </ThemedText>
        </StyledLink>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});