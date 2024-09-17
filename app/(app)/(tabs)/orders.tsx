import { StyleSheet, TextProps, View } from 'react-native';
import { ThemedText, ThemedTextProps } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderContext } from '@/contexts/orderCtx';
import { useContext } from 'react';
import { TOrderProduct } from '@/hooks/useOrders';
import OrderProduct from '@/components/OrderProduct';
import UID from '@/util/UID';
import toCurrency from '@/util/toCurrency';
import StyledLink from '@/components/StyledLink';
import Button from '@/components/Button';

export type CartDetailTextProps = TextProps & ThemedTextProps & { leftText: string, rightText: string }

export const CartDetailText = ({ leftText, rightText, ...otherProps }: CartDetailTextProps) => {
  return (
    <ThemedView {...otherProps} style={[otherProps.style, { paddingHorizontal: 28, justifyContent: 'space-between', flexDirection: 'row' }]}>
      <ThemedText {...otherProps} >{ leftText }</ThemedText>
      <ThemedText {...otherProps} >{ rightText }</ThemedText>
    </ThemedView>
  )
};

export default function Order() {
  const { order, modifyOrderProduct, removeProductFromOrder, orderSubtotal } = useContext(OrderContext);
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
        <CartDetailText leftText='Shipping Fees:' rightText={toCurrency(5)} />
        <CartDetailText leftText='Discount:' rightText={toCurrency(0)} />
        <ThemedView style={styles.footer} >
          <CartDetailText leftText='Total' type='title' rightText={toCurrency(orderSubtotal + 5)} />
          <Button style={styles.payButton}>
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
    paddingHorizontal: 16,
    width: '100%',
  },
  payButton: {
    width: '100%',
    alignSelf: 'center',
    elevation: 16,
  },
});
