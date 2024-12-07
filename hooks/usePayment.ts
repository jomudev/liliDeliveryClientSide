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
import databaseAPI from "@/apis/databaseAPI";
import { TOrderProduct } from "./useOrders";
import { TAddress } from "./useAddresses";
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
      paymentIntentSecret,
      ephemeralKey,
      customer,
    } = await api.paymentSheetParams({
      amount : amount,
      localCustomerId: localStripeCustomer.trim(),
    });
    console.warn(paymentIntent);
    if (!localStripeCustomer) {
      setLocalStripeCustomer(customer);
    }
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Lili's Delivery",
      customerId: customer,
      returnURL: 'exp://128.0.0.1:8081/--/(app)/(tabs)/orders',
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntentSecret,
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

  const openPaymentSheet = async (orderData: TOrderData) => {
    setLoading(true);
    let paymentIntent = await initializePaymentSheet();
    let { error } = (await presentPaymentSheet());
    if (!error) {
      await databaseAPI().createOrder({
        ...orderData,
        paymentIntent: paymentIntent,
      });
    }
    if (error) {
      throw error;
    }
    setLoading(false);
  };
  return {
    openPaymentSheet,
    loading,
  }
} 

export type TPaymentOrderData = TOrderData & {
  paymentIntent: string,
};

export type TOrderData = {
  order: TOrderProduct[],
  orderTotal: number,
  shippingAddress: TAddress | null,
  shippingComment: string,
  shippingContact: string,
  userId: string,
  branchId: string, 
}
