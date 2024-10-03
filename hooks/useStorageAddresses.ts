import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { TAddress } from "./useAddresses";

export default function useStorageAddresses() {
  const [state, setState] = useState<TAddress[]>([]);
  
  useEffect(() => {
    (async () => {
      let storedAddresses = await AsyncStorage.getItem('@addresses');
      if (storedAddresses) {
        setState(JSON.parse(storedAddresses));
      }
    })();
  }, []);

  function setStorageAddresses(addresses: TAddress[]) {
    setState(addresses);
    AsyncStorage.setItem('@addresses', JSON.stringify(addresses));
  }

  return [state, setStorageAddresses];
}