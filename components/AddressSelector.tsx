import useAddresses, { TAddress } from "@/hooks/useAddresses";
import { Pressable, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useContext, useState } from "react";
import StyledLink, { StyledLinkStyles } from "./StyledLink";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import UID from "@/util/UID";
import { AddressesContext } from "@/contexts/addressesCtx";
import AddressSelectorItem from "./AddressSelectorItem";

export type AddressSelectorProps = {
  onSelectAddress: (address: TAddress) => void;
}

export default function AddressSelector ({ onSelectAddress }: AddressSelectorProps) {
  const { addresses, selectAddress } = useContext(AddressesContext);
  const theme = useColorScheme() ?? 'light';
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[
        styles.container, 
        { backgroundColor: theme == 'dark' ? 'rgba(100,100,100,0.3)' : 'rgba(200, 200, 200, 0.3)' }
        ]} >
      {
        addresses.map((address: TAddress) => (
          <AddressSelectorItem 
           onPress={() => {
            selectAddress(address.id);
            onSelectAddress(address);
          }} 
           address={address} 
           key={UID().generate()} 
           />
        ))
      }
      <StyledLink href='/(app)/addresses'>
        <MaterialCommunityIcons name='map-marker' size={16} color={Colors[theme].icon} />
        <ThemedText> Manage Addresses </ThemedText>
      </StyledLink>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flexDirection: 'row',
  },
});