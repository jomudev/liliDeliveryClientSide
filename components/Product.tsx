import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { Image } from "./Image";
import { ThemedText } from "./ThemedText";
import toCurrency from "@/util/toCurrency";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BlurView from "./BlurView";
import React from "react";
import { Link } from "expo-router";
import { TComplement } from "@/app/(app)/addComplement";
import { Text } from "react-native";

export type ProductProps = {
  id: string,
  name: string;
  description: string;
  branchId: string;
  price: number;
  imageURL: string;
};

export default function Product({ branchId, id, name, price, description, imageURL }: ProductProps) {
  return (
    <ThemedView style={styles.container}>
      <Image src={imageURL} style={styles.productImage}/>
      <ThemedView style={styles.productContent}>
        <BlurView style={styles.productFooter}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.productDescription}>  
            <ThemedText style={styles.productDescription} type='defaultSemiBold'> { toCurrency(price) } </ThemedText>
            | { name } 
          </Text>
          <Pressable  
            style={styles.addToCartButton} >
              <Link push href={{
                  pathname: `/(app)/addComplement`,
                  params: {
                    branchId, 
                    productId: id,
                  },
                  }}  > 
                <MaterialCommunityIcons name='cart-outline' size={24} color={'white'} />
              </Link>
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
  productDescription: {
    paddingVertical: 6,
    flex: 1,
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