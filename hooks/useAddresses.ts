import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TAddress = {
  id: string,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  userNote: string,
  city: string,
  state: string,
  zip: string,
  addressLine1: string,
  addressLine2: string,
};

export default function useAddresses () {
  const [addresses, dispatch] = useState<TAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const getAddresses = useCallback(async () => {
    let storedAddressesString = await AsyncStorage.getItem('@addresses');
    let parsedStoredAddresses: TAddress[] = Array.from(JSON.parse(storedAddressesString || '[]'));
    dispatch(parsedStoredAddresses);
    if (parsedStoredAddresses.length) {
      selectAddress(parsedStoredAddresses[0].id);
    }
  }, []);

  useEffect(() => {
    getAddresses();
  }, [])

  function addAddress (address: TAddress) {
    if (!address) return;
    if (!Object.hasOwn(address, 'name')) return;
    if (!Object.hasOwn(address, 'id')) return;
    let addressExist = addresses.find((storedAddress: TAddress) => storedAddress.id == address.id);
    addressExist = addressExist || addresses.find((storedAddress: TAddress) => storedAddress.name == address.name);
    if (addressExist) return;
    dispatch(addresses.concat(address));
  };

  function selectAddress(addressId: string) {
    if (!addressId) return;
    if (selectedAddress == addressId) return;
    setSelectedAddress(addressId);
    AsyncStorage.setItem('@selectedAddress', addressId);
  }

  function unselectAddress() {
    setSelectedAddress(null);
  }

  function removeAddress(addressId: string) {
    dispatch(addresses.filter((address) => address.id !== addressId));
  }

  function modifyAddress(modifiedAddress: TAddress) {
    dispatch(addresses.map((address) => address.id == modifiedAddress.id ? modifiedAddress : address));
  }

  function setAddresses(addresses: TAddress[]) {
    dispatch(addresses);
  }

  return {
    addresses,
    selectedAddress,
    addAddress,
    modifyAddress,
    removeAddress,
    setAddresses,
    selectAddress,
    unselectAddress,
  };
}