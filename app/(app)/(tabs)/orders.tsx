import { StyleSheet, TextProps, ScrollView, View } from 'react-native';
import { ThemedText, ThemedTextProps } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderContext } from '@/contexts/orderCtx';
import { useContext, useRef, useState } from 'react';
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
import { AddressesContext } from '@/contexts/addressesCtx';

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
  const { user } = useContext(AuthContext); 
  const { addresses, selectedAddress } = useContext(AddressesContext);
  const address = useRef(addresses.find((address) => address.id == selectedAddress));
  const { 
    order, 
    orderSubtotal,
    businessOrder,
    modifyOrderProduct, 
    removeProductFromOrder, 
    clearOrder, 
  } = useContext(OrderContext);
  const { openPaymentSheet, loading } = usePayment(orderSubtotal);
  const [paymentState, setPaymentState] = useState<TPaymentStates>(UNINITIALIZED);

  const pay = async () => {
    setPaymentState(INITIALIZED);
    let paymentIntent;
    try {
      paymentIntent = await openPaymentSheet();
      setPaymentState(SUCCESS);
      clearOrder();
    } catch (err) {
      setPaymentState(ERROR);
      feedback('❌💳 We are having troubles connecting the payment system');
    }
    try {
      databaseAPI().createOrder({
        paymentIntent,
        order,
        address: address.current,
        orderTotal: orderSubtotal,
        userId: user?.uid || '',
        branchId: businessOrder,
      });
    } catch (err) {
      console.log(`error verifying order with the server, check the ${paymentIntent} payment intent status... ERROR:`, err); 
      feedback('contact for support to check your order state...');  
    }
  }

  if (order.length < 1) {
    return (
      <ThemedView style={styles.emptyOrdersContainer}>
        <ThemedText style={{ textAlign: 'center', alignSelf: 'center' }}>🤷🏻 No orders yet</ThemedText>
        <StyledLink href={'/(app)/(tabs)'}>
          🏬 Go to Business Screen
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
          <View style={styles.addressForm}>
            <ThemedText type='subtitle'>
              Shipping Address
            </ThemedText>
            <AddressSelector />
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
  addressForm: {
    padding: 24,
  },
});
