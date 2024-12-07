import AddressCard from "@/components/AddressCard";
import StyledLink from "@/components/StyledLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { AddressesContext } from "@/contexts/addressesCtx";
import { TAddress } from "@/hooks/useAddresses";
import feedback from "@/util/feedback";
import UID from "@/util/UID";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressesScreen () {
  const { 
    addresses, 
    selectedAddress, 
    selectAddress, 
    removeAddress,
  } = useContext(AddressesContext);
  const theme = useColorScheme() || 'light';

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Addresses' }} />
      <ThemedView style={styles.container}>
        <ScrollView>
          <SafeAreaView style={styles.container}>
            {
              addresses.map((address: TAddress) => (
                <AddressCard 
                onDelete={() => removeAddress(address.id)}
                onEdit={() => feedback('edit address')}
                key={address.id}
                {...address}
                onPress={() => selectAddress(address.id)} 
                selected={address.id == selectedAddress}  
                />  
              ))
            }
            <StyledLink href={'/(app)/addAddress'}>
              <Ionicons name={'map'} size={16} color={Colors[theme].text} />
              <ThemedText type="defaultSemiBold" > Add Address </ThemedText>
            </StyledLink>
          </SafeAreaView>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});