import { Dispatch, ReducerAction, useEffect, useReducer, useState } from "react";
import { useStorageState } from "./useStorageState";
import UID from "@/util/UID";

export type TAddress = {
  id?: number,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  userNote: string,
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

  function addAddress (address: TAddress) {
    if (!Boolean(address.name)) return;
    if (addresses.find((storedAddress: TAddress) => storedAddress.name == address.name)) return;
    dispatch(addresses.concat(address));
  };

  function removeAddress(addressId: number) {
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
    addAddress,
    modifyAddress,
    removeAddress,
    setAddresses,
  };
}