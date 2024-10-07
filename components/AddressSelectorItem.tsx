import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useContext } from "react";
import { AddressesContext } from "@/contexts/addressesCtx";
import { TAddress } from "@/hooks/useAddresses";
import UID from "@/util/UID";
import { StyledLinkStyles } from "./StyledLink";
import { Colors } from "@/constants/Colors";

export default function AddressSelectorItem ({ address }: { address: TAddress }) {
  const { selectedAddress, selectAddress } = useContext(AddressesContext);
  const theme = useColorScheme() ?? 'light';
  return (
    <Pressable 
      onPress={() => selectAddress(address.id)}
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