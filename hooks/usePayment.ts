import paymentAPI from "@/apis/paymentAPI";
import { CustomerAdapter, CustomerPaymentOption, useStripe } from "@stripe/stripe-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useStorageState } from "./useStorageState";
import { AuthContext } from "@/contexts/authCtx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderContext } from "@/contexts/orderCtx";
import feedback from "@/util/feedback";
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
  const paymentSheetInitialized = useRef(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

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
        name: user?.displayName,
        email: user?.email,
        phone: user?.phoneNumber,
      },
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
        currencyCode: 'usd',
      },
    });
    paymentSheetInitialized.current = true;
    if (error) {
      setLoading(true);
      console.error('stripe payment-sheet error', error);
      return;
    }
    setLoading(false);
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    
    let error;
    try {
      await initializePaymentSheet();
      error = (await presentPaymentSheet()).error;
    } catch (err) {
      console.error(err);
      setLoading(false);
      feedback('❌💳 We are having troubles connecting the payment system');
      return;
    }

    if (error) {  
      console.error(`${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is in process!');
    }
    setLoading(false);
    return error;
  };

  return {
    openPaymentSheet,
    loading,
  }

} 