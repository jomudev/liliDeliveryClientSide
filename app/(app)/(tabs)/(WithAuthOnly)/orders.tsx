import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextProps } from 'react-native';
import { Input } from '@rneui/base';
import { ThemedText, ThemedTextProps } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { OrderContext } from '@/contexts/orderCtx';
import { AuthContext } from '@/contexts/authCtx';
import { AddressesContext } from '@/contexts/addressesCtx';
import OrderProduct from '@/components/OrderProduct';
import toCurrency from '@/util/toCurrency';
import StyledLink from '@/components/StyledLink';
import Button from '@/components/Button';
import feedback from '@/util/feedback';
import AddressSelector from '@/components/AddressSelector';
import usePayment from '@/hooks/usePayment';
import LoadingIndicator from '@/components/LoadingIndicator';
import toJSON from '@/util/toJSON';
import { Colors } from '@/constants/Colors';
import { router, Stack } from 'expo-router';
import { TAddress } from '@/hooks/useAddresses';

export type CartDetailTextProps = TextProps & ThemedTextProps & { leftText: string, rightText: string };

export const CartDetailText = ({ leftText, rightText, ...otherProps }: CartDetailTextProps) => (
  <ThemedView {...otherProps} style={[otherProps.style, styles.cartDetailContainer]}>
    <ThemedText {...otherProps}>{leftText}</ThemedText>
    <ThemedText {...otherProps}>{rightText}</ThemedText>
  </ThemedView>
);

export default function OrderScreen() {
  const theme = useColorScheme() || 'light';
  const { user } = useContext(AuthContext);
  const { addresses, selectedAddress } = useContext(AddressesContext);
  const { order, orderSubtotal, branchOrder, modifyOrderProduct, removeProductFromOrder, clearOrder } = useContext(OrderContext);
  const { openPaymentSheet, loading: paymentLoading } = usePayment(orderSubtotal);
  
  const shippingAddress = useRef<TAddress | null>(null);
  const shippingComment = useRef('');
  const shippingContact = useRef(user?.phoneNumber || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectedAddressData = addresses.find((address) => address.id === selectedAddress) || null;
    shippingAddress.current = selectedAddressData;
  }, [selectedAddress]);

  const pay = async () => {
    if (!user) {
      feedback('Please sign in to continue');
      router.navigate('/sign-in'); 
      return;
    }
    if (shippingAddress.current == null) {
      feedback('Please select a shipping address');
      return;
    }
    setIsLoading(true);
    try {
      if (!orderSubtotal || !user?.uid || !branchOrder) {
        throw new Error(`Invalid payment data: ${toJSON({ orderSubtotal, userId: user?.uid, branchOrder })}`);
      }
      await openPaymentSheet({
        order,
        shippingAddress: shippingAddress.current,
        shippingComment: shippingComment.current,
        shippingContact: shippingContact.current,
        orderTotal: orderSubtotal,
        userId: user.uid,
        branchId: branchOrder,
      });
      clearOrder();
      router.push('/(app)/ordersHistory');
    } catch (err) {
      console.error(err);
      if (err.code === 'Canceled') return;
      feedback('❌💳 There was an issue with the payment process');
    } finally {
      setIsLoading(false);
    }
    console.groupEnd();
  };

  if (isLoading) {
    return <LoadingIndicator loadingText="Processing Order..." />;
  }

  if (order.length < 1) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, headerTitle: 'Orders' }} />
        <ThemedView style={styles.emptyOrdersContainer}>
          <ThemedText style={styles.centeredText}>🤷🏻 No active order yet</ThemedText>
          <StyledLink href={'/(app)/(tabs)/(explore)'}>🏬 Go to Business Screen</StyledLink>
          <StyledLink href={'/(app)/ordersHistory'}>⌛️ Go to Orders History Screen</StyledLink>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, headerTitle: 'Orders' }} />
      <ThemedView style={styles.mainContainer}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {order.map((product) => (
              <OrderProduct
                key={product.id} {...product}
                onChangeQuantity={(quantity) => modifyOrderProduct({ ...product, quantity })}
                onHandleDelete={() => removeProductFromOrder(product.id)}
              />
            ))}
            <CartDetailText leftText="Sub Total:" rightText={toCurrency(orderSubtotal)} />
            <CartDetailText leftText="Shipping Fees:" rightText="Free" />
            <View style={styles.form}>
              <ThemedText type="subtitle">Provide a shipping contact</ThemedText>
              <Input
                numberOfLines={1}
                onChangeText={(text) => (shippingContact.current = text)}
                dataDetectorTypes="phoneNumber"
                textContentType="telephoneNumber"
                leftIcon={{ name: 'phone', color: Colors[theme].icon }}
                placeholder="+1 (555) 555-5555"
              />
              <ThemedText type="subtitle">Select Shipping Address</ThemedText>
              <AddressSelector 
                onSelectAddress={(address) => (shippingAddress.current = address)} 
              />
              <ThemedText type="subtitle">Add shipping instructions</ThemedText>
              <Input
                numberOfLines={4}
                onChangeText={(text) => (shippingComment.current = text)}
                leftIcon={{ name: 'comment', color: Colors[theme].icon }}
                placeholder="May you..?"
              />
            </View>
          </ScrollView>
          <ThemedView style={styles.footer}>
            <CartDetailText leftText="Total" type="title" rightText={toCurrency(orderSubtotal)} />
            <Button isLoading={isLoading} onPress={pay} style={styles.payButton}>
              <ThemedText type="subtitle" lightColor="#fff" darkColor="#111">Continue Pay</ThemedText>
            </Button>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: { flex: 1 },
  emptyOrdersContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centeredText: { textAlign: 'center', alignSelf: 'center' },
  footer: { paddingBottom: 24, paddingTop: 24, paddingHorizontal: 16, width: '100%' },
  payButton: { width: '100%', alignSelf: 'center', elevation: 16 },
  form: { padding: 24 },
  cartDetailContainer: { paddingHorizontal: 28, justifyContent: 'space-between', flexDirection: 'row' },
});
