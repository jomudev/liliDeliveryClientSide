import { StyleSheet, TextProps, ScrollView, View, useColorScheme } from 'react-native';
import { ThemedText, ThemedTextProps } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderContext } from '@/contexts/orderCtx';
import { useContext, useEffect, useRef, useState } from 'react';
import { TOrderProduct } from '@/hooks/useOrders';
import OrderProduct from '@/components/OrderProduct';
import UID from '@/util/UID';
import toCurrency from '@/util/toCurrency';
import StyledLink from '@/components/StyledLink';
import Button from '@/components/Button';
import feedback from '@/util/feedback';
import AddressSelector from '@/components/AddressSelector';
import usePayment from '@/hooks/usePayment';
import React from 'react';
import databaseAPI from '@/apis/databaseAPI';
import { AuthContext } from '@/contexts/authCtx';
import { TAddress } from '@/hooks/useAddresses';
import { Input } from '@rneui/base';
import { Colors } from '@/constants/Colors';
import { AddressesContext } from '@/contexts/addressesCtx';
import LoadingIndicator from '@/components/LoadingIndicator';

export type CartDetailTextProps = TextProps & ThemedTextProps & { leftText: string, rightText: string }

export const CartDetailText = ({ leftText, rightText, ...otherProps }: CartDetailTextProps) => {
  return (
    <ThemedView {...otherProps} style={[otherProps.style, { paddingHorizontal: 28, justifyContent: 'space-between', flexDirection: 'row' }]}>
      <ThemedText {...otherProps} >{ leftText }</ThemedText>
      <ThemedText {...otherProps} >{ rightText }</ThemedText>
    </ThemedView>
  )
};

export type TPaymentStates = 'success' | 'error' | 'initialized' | 'uninitialized';
const UNINITIALIZED = 'uninitialized';
const INITIALIZED = 'initialized';
const SUCCESS = 'success';
const ERROR = 'error';

export default function OrderScreen() {
  const theme = useColorScheme() || 'light';
  const { user } = useContext(AuthContext); 
  const { addresses, selectedAddress } = useContext(AddressesContext);
  const shippingAddress = useRef<TAddress>();
  const shippingComment = useRef<string>('');
  const shippingContact = useRef<string>(user?.phoneNumber || '');
  const { 
    order, 
    orderSubtotal,
    branchOrder,
    modifyOrderProduct, 
    removeProductFromOrder, 
    clearOrder, 
  } = useContext(OrderContext);
  const { openPaymentSheet, loading } = usePayment(orderSubtotal);
  const [paymentState, setPaymentState] = useState<TPaymentStates>(UNINITIALIZED);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectedAddressData = addresses.find((address) => address.id == selectedAddress) || undefined;
    shippingAddress.current = selectedAddressData;
  }, [selectedAddress]);

  const pay = async () => {
    setIsLoading(true);
    setPaymentState(INITIALIZED);
    let paymentIntent;
    //try {
    //   paymentIntent = await openPaymentSheet();
    //   setPaymentState(SUCCESS);
    // } catch (err) {
    //   setPaymentState(ERROR);
    //   feedback('❌💳 We are having troubles connecting the payment system');
    // }

    try {
      await databaseAPI().createOrder({
        paymentIntent: paymentIntent || 'test_intent',
        order,
        shippingAddress: shippingAddress.current || null,
        shippingComment: shippingComment.current,
        shippingContact: shippingContact.current,
        orderTotal: orderSubtotal,
        userId: user?.uid || '',
        branchId: branchOrder || null,
      });
      feedback('🎉 Order Successful! 🎉');
      setIsLoading(false);
      clearOrder();
    } catch (err) {
      console.log(`error verifying order with the server, check the ${paymentIntent} payment intent status... ERROR:`, err); 
      feedback('contact for support to check your order state...');  
    }
  }

  if (isLoading) return <LoadingIndicator loadingText='Processing Order...' />;

  if (order.length < 1) {
    return (
      <ThemedView style={styles.emptyOrdersContainer}>
        <ThemedText style={{ textAlign: 'center', alignSelf: 'center' }}>🤷🏻 No active order yet</ThemedText>
        <StyledLink href={'/(app)/(tabs)'}>
          🏬 Go to Business Screen
        </StyledLink>
        <StyledLink href={'/(app)/ordersHistory'}>
          ⌛️ Go to Orders History Screen
        </StyledLink>
      </ThemedView>
    )
  }
  return (
    <ThemedView style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView>

          {
            order.map((product: TOrderProduct) => (
              <OrderProduct 
                key={UID().generate()} {...product} 
                onChangeQuantity={(quantity) => {
                  modifyOrderProduct({ ...product, quantity: quantity });
                }}
                onHandleDelete={ () => removeProductFromOrder(product.id) }
              />
            ))
          }
          <CartDetailText leftText='Sub Total:' rightText={toCurrency(orderSubtotal)} />
          <CartDetailText leftText='Shipping Fees:' rightText={'Free'} />
          <View style={styles.form}>
          <ThemedText type='subtitle'>
              Provide a shipping contact
            </ThemedText>
          <Input 
              numberOfLines={1} 
              onChangeText={(text) => shippingContact.current = text}
              dataDetectorTypes={['phoneNumber']}
              textContentType='telephoneNumber'
              leftIcon={{
                name: 'phone',
                color: Colors[theme].icon,
              }} 
              placeholder='+1 (555) 555-5555'
            />
            <ThemedText type='subtitle'>
              Select Shipping Address
            </ThemedText>
            <AddressSelector onSelectAddress={(address) => shippingAddress.current = address} />
            <ThemedText type='subtitle'>
              Add shipping instructions
            </ThemedText>
            <Input 
              numberOfLines={4} 
              onChangeText={(text) => shippingComment.current = text}
              leftIcon={{
                name: 'comment',
                color: Colors[theme].icon,
              }} 
              placeholder='May you..?' 
            />
          </View>
        </ScrollView>
        <ThemedView style={styles.footer} >
          <CartDetailText leftText='Total' type='title' rightText={toCurrency(orderSubtotal)} />
          <Button isLoading={loading} onPress={pay} style={styles.payButton}>
            <ThemedText type='subtitle' lightColor='#fff' darkColor='#111' >Continue Pay</ThemedText>
          </Button>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  emptyOrdersContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  payButton: {
    width: '100%',
    alignSelf: 'center',
    elevation: 16,
  },
  form: {
    padding: 24,
  },
});
