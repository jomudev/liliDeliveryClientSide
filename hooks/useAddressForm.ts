import { useState } from "react";

export type TAddressForm = {
  addressAlias: string,
  streetAddress: string,
  apt: string,
  city: string,
  countryState: string,
  zipCode: string,
}

export const addressFormActionTypes = {
  SET_STREET_ADDRESS: 'SET_STREET_ADDRESS',
  SET_APT: 'SET_APT',
  SET_CITY: 'SET_CITY',
  SET_COUNTRY_STATE: 'SET_COUNTRY_STATE',
  SET_ZIP_CODE: 'SET_ZIP_CODE',
  SET_ADDRESS: 'SET_ADDRESS',
  SET_ADDRESS_ALIAS: 'SET_ADDRESS_ALIAS',
}

export default function useAddressForm() {
  const [state, dispatch] = useState<TAddressForm>({
    addressAlias: 'Main address',
    streetAddress: '',
    apt: '',
    city: '',
    countryState: '',
    zipCode: '',
  });

  function setAddressAlias(addressAlias: string) {
    dispatch({
      ...state,
      addressAlias,
    });
  }

  function setAddress(addressData: TAddressForm) {
    dispatch(addressData);
  }

  function setStreetAddress (streetAddress: string) {
    dispatch({
      ...state,
      streetAddress,
    });
  }

  function setApt (apt: string) {
    dispatch({
      ...state,
      apt,
    });
  }

  function setCity (city: string) {
    dispatch({
      ...state,
      city,
    });
  }

  function setCountryState (countryState: string) {
    dispatch({
      ...state,
      countryState
    });
  }

  function setZipCode (zipCode: string) {
    dispatch({
      ...state,
      zipCode
    });
  }

  return {
    ...state,
    setAddressAlias,
    setStreetAddress,
    setApt,
    setCity,
    setCountryState,
    setZipCode,
    setAddress
  }
}