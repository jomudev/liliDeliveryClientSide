import { Pressable, StyleSheet, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { Image } from "./Image";
import { ThemedText } from "./ThemedText";
import toCurrency from "@/util/toCurrency";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BlurView from "./BlurView";
import { TOrderProduct } from "@/hooks/useOrders";
import { TProduct } from "@/hooks/useCatalog";

export type ProductProps = {
  id: number,
  name: string;
  description: string;
  price: number;
  imageURL: string;
  handleAddToCart: (product: TProduct) => void;
};

export default function Product({  name, price, description, imageURL, handleAddToCart }: ProductProps) {

  return (
    <ThemedView style={styles.container}>
      <Image src={imageURL} style={styles.productImage}/>
      <ThemedView style={styles.productContent}>
        <BlurView style={styles.productFooter}>
          <ThemedText style={styles.productName}> 
            <ThemedText type='defaultSemiBold'> { toCurrency(price) } </ThemedText>
            | { name } 
          </ThemedText>
          <Pressable onPress={ () => {
            handleAddToCart();
          }} style={styles.addToCartButton} >
            <MaterialCommunityIcons name='cart-outline' size={24} color={'white'} />
          </Pressable>
        </BlurView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginVertical: 16,
    gap: 8,
    borderRadius: 24,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productContent: {
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 8,
  },
  productName: {
    paddingVertical: 6,
  },
  productFooter: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center',
  },
  addToCartButton: {
    backgroundColor: 'black',
    height: '100%',
    padding: 8,
    borderRadius: 12,
  },
});