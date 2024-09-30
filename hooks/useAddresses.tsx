import { Dispatch, ReducerAction, useEffect, useReducer } from "react";
import { ORDER_ACTION_TYPES } from "./useOrders";
import { useStorageState } from "./useStorageState";
import UID from "@/util/UID";

export type TAddress = {
  id?: number,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
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
  const [addresses, dispatch] = useReducer(addressesReducer, []);
  const [storedAddresses, setStoredAddresses] = useStorageState('@addresses');
  
  useEffect(() => {
    if (Boolean(storedAddresses) && typeof storedAddresses == 'string') {
      dispatch({
        type: ADDRESSES_ACTION_TYPE.SET_ADDRESSES,
        data: JSON.parse(storedAddresses),
      });
    }
  }, [storedAddresses]);

  useEffect(() => {
    setStoredAddresses(JSON.stringify(addresses));
    console.info('addresses modified');
  }, [addresses]);

  useEffect(() => {
    setStoredAddresses(JSON.stringify(addresses));
  }, [addresses]);

  function addAddress (address: TAddress) {
    if (addresses.find((storedAddress: TAddress) => storedAddress.id == address.id || storedAddress.name == address.name)) return;
    dispatch({
      type: ORDER_ACTION_TYPES.ADD_ORDER,
      data: {
        ...address,
        id: UID().generate(),
      },
    });
  };

  function removeAddress(addressId: number) {
    dispatch({
      type: ORDER_ACTION_TYPES.REMOVE_ORDER,
      data: addressId,
    });
  }

  function modifyAddress(address: TAddress) {
    dispatch({
      type: ORDER_ACTION_TYPES.MODIFY_ORDER,
      data: address,
    });
  }

  return {
    addresses,
    addAddress,
    modifyAddress,
    removeAddress,
  };
}