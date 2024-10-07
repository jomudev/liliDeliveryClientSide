import { useState } from "react";
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

export const ADDRESSES_ACTION_TYPE = {
  ADD_ADDRESS: 'ADD_ADDRESS',
  MODIFY_ADDRESS: 'MODIFY_ADDRESS',
  REMOVE_ADDRESS: 'REMOVE_ADDRESS',
  SET_ADDRESSES: 'SET_ADDRESSES',
};

const addressesReducer = (state: TAddress[], action: {type: string, data: any}) => {
  let newState;
  if (action.type = ADDRESSES_ACTION_TYPE.ADD_ADDRESS) {
    newState = state.concat(action.data);
    return newState;
  }
  if (action.type === ADDRESSES_ACTION_TYPE.REMOVE_ADDRESS) {
    newState = state.filter((address) => address.id !== action.data);
    return newState;
  }
  if (action.type == ADDRESSES_ACTION_TYPE.MODIFY_ADDRESS) {
    newState = state.map((address) => address.id == action.data.id ? action.data : product);
    return newState; 
  }
  if (action.type == ADDRESSES_ACTION_TYPE.SET_ADDRESSES) {
    newState = action.data;
    return newState;
  }
  return state;
}

export default function useAddresses () {
  const [addresses, dispatch] = useState<TAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

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