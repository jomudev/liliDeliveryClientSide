import paymentAPI from "@/apis/paymentAPI";
import { CustomerAdapter, CustomerPaymentOption, useStripe } from "@stripe/stripe-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useStorageState } from "./useStorageState";
import { AuthContext } from "@/contexts/authCtx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderContext } from "@/contexts/orderCtx";
import feedback from "@/util/feedback";
import { AddressesContext } from "@/contexts/addressesCtx";
const api = paymentAPI();

export function useStripeLocalCustomer() {
  const [state, setState] = useState<string>('');

  async function handleSaveStripeCustomer(customerData: string) {
    setState(customerData);
    await AsyncStorage.setItem("@stripe-customer", customerData);
  }

  useEffect(() => {
    (async function() {
      let storageCustomer: string = await AsyncStorage.getItem('@stripe-customer') || ''; 
      if (storageCustomer.match(new RegExp("^[^a-zA-Z0-9]+$"))) {
        storageCustomer = '';
      }
      setState(storageCustomer.trim());
    })()
  }, []);

  return { localStripeCustomer: state, setLocalStripeCustomer: handleSaveStripeCustomer };
}

export default function usePayment(amount: number){
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { localStripeCustomer, setLocalStripeCustomer } = useStripeLocalCustomer();
  const { user } = useContext(AuthContext);
  const { selectedAddress, addresses } = useContext(AddressesContext);
  const [loading, setLoading] = useState(false);
  const address = useRef(addresses.find((address) => address.id == selectedAddress));

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await api.paymentSheetParams({
      amount,
      localCustomerId: localStripeCustomer.trim(),
    });
    if (!localStripeCustomer) {
      setLocalStripeCustomer(customer);
    }
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Lili's Delivery",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: user?.displayName || undefined,
        email: user?.email || undefined,
        phone: user?.phoneNumber || undefined,
        address: {
          city: address.current?.city,
          state: address.current?.state,
          line1: address.current?.addressLine1,
          line2: address.current?.addressLine2,
        }
      }, 
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
        currencyCode: 'usd',
      },
    });
    if (error) {
      setLoading(false);
      throw error.message;
    }
    setLoading(false);
    return paymentIntent;
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    
    let error;
    let paymentIntent;
    try {
      paymentIntent = await initializePaymentSheet();
      error = (await presentPaymentSheet()).error;
    } catch (err) {
      console.error(err);
      setLoading(false);
      feedback('❌💳 We are having troubles connecting the payment system');
      return;
    }

    setLoading(false);
    if (error) {  
      console.error('stripe payment-sheet error', JSON.stringify(error, null, 2));
      throw error;
    }
    return paymentIntent;
  };

  return {
    openPaymentSheet,
    loading,
  }

} 