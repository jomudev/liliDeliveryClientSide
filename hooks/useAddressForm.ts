import addressAPI from "@/apis/addressAPI";
import { useEffect, useReducer } from "react";
import { ADDRESSES_ACTION_TYPE } from "./useAddresses";

export type TAddressForm = {
  fullAddress: string,
  streetAddress: string,
  apt: string,
  city: string,
  countryState: string,
  zipCode: string,
}

export const addressFormActionTypes = {
  SET_FULL_ADDRESS: 'SET_FULL_ADDRESS',
  SET_STREET_ADDRESS: 'SET_STREET_ADDRESS',
  SET_APT: 'SET_APT',
  SET_CITY: 'SET_CITY',
  SET_COUNTRY_STATE: 'SET_COUNTRY_STATE',
  SET_ZIP_CODE: 'SET_ZIP_CODE',
  SET_ADDRESS: 'SET_ADDRESS',
}

export function addressReducer(state: TAddressForm, action: { type: string, data: string | TAddressForm}) {
  let newState: TAddressForm;
  if (action.type == addressFormActionTypes.SET_FULL_ADDRESS) {
    newState = {
      ...state,
      fullAddress: action.data, 
    };
    return newState;
  }
  if (action.type == addressFormActionTypes.SET_ADDRESS) {
    newState = action.data;
    return newState;
  }
  if (action.type == addressFormActionTypes.SET_STREET_ADDRESS) {
    newState = {
      ...state,
      streetAddress: action.data,
    }
    return newState;
  }
  if (action.type == addressFormActionTypes.SET_APT) {
    newState = {
      ...state,
      apt: action.data,
    }
    return newState;
  }
  if (action.type == addressFormActionTypes.SET_CITY) {
    newState = {
      ...state,
      city: action.data,
    }
    return newState;
  }
  if (action.type == addressFormActionTypes.SET_COUNTRY_STATE) {
    newState = {
      ...state,
      countryState: action.data,
    }
    return newState;
  }
  if (action.type == addressFormActionTypes.SET_ZIP_CODE) {
    newState = {
      ...state,
      zipCode: action.data,
    }
    return newState;
  }
return state;
}

export default function useAddressForm() {
  const [value, dispatch] = useReducer(addressReducer, {
    fullAddress: '',
    streetAddress: '',
    apt: '',
    city: '',
    countryState: '',
    zipCode: '',
  });

  function setFullAddress(value: string) {
    dispatch({
      type: addressFormActionTypes.SET_FULL_ADDRESS,
      data: value,
    });
  }

  function setAddress(addressData: TAddressForm) {
    dispatch({
      type: addressFormActionTypes.SET_ADDRESS,
      data: addressData,
    });
  }

  function setStreetAddress (data: string) {
    dispatch({
      type: addressFormActionTypes.SET_STREET_ADDRESS,
      data,
    });
  }

  function setApt (data: string) {
    dispatch({
      type: addressFormActionTypes.SET_APT,
      data,
    });
  }

  function setCity (data: string) {
    dispatch({
      type: addressFormActionTypes.SET_CITY,
      data,
    });
  }

  function setCountryState (data: string) {
    dispatch({
      type: addressFormActionTypes.SET_COUNTRY_STATE,
      data,
    });
  }

  function setZipCode (data: string) {
    dispatch({
      type: addressFormActionTypes.SET_ZIP_CODE,
      data,
    });
  }

  return {
    ...value,
    address: value,
    setStreetAddress,
    setApt,
    setCity,
    setCountryState,
    setZipCode,
    setAddress
  }
}