import StyledLink from "@/components/StyledLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { AddressesContext } from "@/contexts/addressesCtx";
import { TAddress } from "@/hooks/useAddresses";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressesScreen () {
  const { addresses } = useContext(AddressesContext);
  const theme = useColorScheme() || 'light';

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          {
            addresses.map((address: TAddress) => (
              <ThemedText>
                {JSON.stringify(address, null, 2)}
              </ThemedText>
            ))
          }
          <StyledLink href={'/(app)/addAddress'}>
            <Ionicons name={'map'} size={16} color={Colors[theme].text} />
            <ThemedText type="defaultSemiBold" > Add Address </ThemedText>
          </StyledLink>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});