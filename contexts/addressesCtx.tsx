import useAddresses, { TAddress } from "@/hooks/useAddresses";
import React, { createContext, PropsWithChildren, useEffect } from "react";
import useStorageAddresses from "@/hooks/useStorageAddresses";
import { useStorageState } from "@/hooks/useStorageState";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AddressesContext = createContext<{
  addresses: TAddress[],
  addAddress: (address: TAddress) => void,
  modifyAddress: (address: TAddress) => void,
  removeAddress: (addressId: number) => void,
}>({
  addresses: [],
  addAddress: () => {},
  modifyAddress: () => {},
  removeAddress: () => {},
});

export default function AddressesProvider ({ children }: PropsWithChildren) {
  const { 
    setAddresses, 
    addresses, 
    addAddress,
    modifyAddress, 
    removeAddress
  } = useAddresses();

  useEffect(() => {
    (async function() {
      let storedAddressesString = await AsyncStorage.getItem('@addresses'); 
      let parsedStoredAddresses: TAddress[] = Array.from(JSON.parse(storedAddressesString || '[]'));
      const validAddresses = parsedStoredAddresses.filter((address) => Object.hasOwn(address, 'name')); 
      setAddresses(validAddresses);
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
    }}>
      { children }
    </AddressesContext.Provider>
  )
};