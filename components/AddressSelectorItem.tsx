import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useContext } from "react";
import { AddressesContext } from "@/contexts/addressesCtx";
import { TAddress } from "@/hooks/useAddresses";
import UID from "@/util/UID";
import { Colors } from "@/constants/Colors";

export default function AddressSelectorItem ({ address, onPress }: { address: TAddress, onPress: () => void }) {
  const { selectedAddress } = useContext(AddressesContext);
  const theme = useColorScheme() ?? 'light';

  function handleOnPress () {
    if (onPress) onPress();
  }

  return (
    <Pressable 
      onPress={handleOnPress}
      key={UID().generate()} 
      style={{
        ...styles.addressItem,
        backgroundColor: selectedAddress === address.id ? Colors[theme].primary : 'rgba(255, 255, 255, 0.7)',
      }}
      >
      <ThemedText 
        lightColor={
          selectedAddress === address.id 
          ? '#fff' 
          : Colors[theme].text
        } 
        type="subtitle" 
        >{ address.name }</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addressItem: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
  },
});