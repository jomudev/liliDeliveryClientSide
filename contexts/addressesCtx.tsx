import useAddresses, { TAddress } from "@/hooks/useAddresses";
import React, { createContext, PropsWithChildren, useEffect } from "react";
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

  useEffect(() => {
    (async function() {
      let storedAddressesString = await AsyncStorage.getItem('@addresses'); 
      let parsedStoredAddresses: TAddress[] = Array.from(JSON.parse(storedAddressesString || '[]'));
      const validAddresses = parsedStoredAddresses.filter((address) => Object.hasOwn(address, 'name')); 
      setAddresses(validAddresses);
      let storedSelectedAddress = await AsyncStorage.getItem('@selectedAddress');
      console.log('SELECTED ADDRESS', storedSelectedAddress);
      if (storedSelectedAddress) {
        selectAddress(storedSelectedAddress);
      }
    })()
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@addresses', JSON.stringify(addresses));
  }, [addresses]);

  function handleAddAddress (address: TAddress) {
    addAddress(address);
  }

  return (
    <AddressesContext.Provider value={{
      addresses,
      addAddress: handleAddAddress,
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