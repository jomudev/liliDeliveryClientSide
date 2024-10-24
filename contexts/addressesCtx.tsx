import useAddresses, { TAddress } from "@/hooks/useAddresses";
import React, { createContext, PropsWithChildren, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AddressesContext = createContext<{
  addresses: TAddress[],
  addAddress: (address: TAddress) => void,
  modifyAddress: (address: TAddress) => void,
  removeAddress: (addressId: string) => void,
  selectedAddress: string | null,
  selectAddress: (addressId: string) => void,
  unselectAddress: () => void,
}>({
  addresses: [],
  addAddress: () => {},
  modifyAddress: () => {},
  removeAddress: () => {},
  selectedAddress: null,
  selectAddress: () => {},
  unselectAddress: () => {},
});

export default function AddressesProvider ({ children }: PropsWithChildren) {
  const { 
    addresses, 
    selectedAddress,
    setAddresses, 
    addAddress,
    modifyAddress, 
    removeAddress,
    selectAddress,
    unselectAddress,
  } = useAddresses();

  const saveAddresses = useCallback(async () => {
    await AsyncStorage.setItem('@addresses', JSON.stringify(addresses));
  }, [addresses]);

  const getSelectedAddress = useCallback(async () => {
    let storedSelectedAddress = await AsyncStorage.getItem('@selectedAddress');
    if (storedSelectedAddress) {
      selectAddress(storedSelectedAddress);
    } else {
      if (addresses.length > 0) {
        selectAddress(addresses[0]?.id);
        AsyncStorage.setItem('@selectedAddress', addresses[0]?.id);
      }
    }
  }, [addresses]);

  useEffect(() => {
    saveAddresses();
    getSelectedAddress();
  }, [addresses]);

  return (
    <AddressesContext.Provider value={{
      addresses,
      addAddress,
      modifyAddress,
      removeAddress,
      selectedAddress,
      selectAddress,
      unselectAddress,
    }}>
      { children }
    </AddressesContext.Provider>
  )
};