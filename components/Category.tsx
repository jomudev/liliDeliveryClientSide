import { TProduct } from "@/hooks/useCatalog";
import { ThemedText } from "./ThemedText";
import { Pressable, StyleSheet, View } from "react-native";
import Product from "./Product";
import UID from "@/util/UID";
import { memo, useRef, useState } from "react";
import ProductsAPI from "@/apis/ProductsAPI";
import React from "react";
import LoadingIndicator from "./LoadingIndicator";
import { useLocalSearchParams } from "expo-router";

export type CategoryProps = {
  name: string;
  products: TProduct[];
};

const MemoProduct = memo(Product);
const productsAPI = ProductsAPI();

export default function Category({ name, products }: CategoryProps) {
  const [categoryProducts, setCategoryProducts] = useState([...products]);
  let { branchId } = useLocalSearchParams();
  const page = useRef(1);
  branchId = branchId.toString();
  const getMoreProducts = async () => {
    const fetchedProducts = await productsAPI.getCategoryProducts(branchId, name, page.current, (page.current + 1) * 5);
    setCategoryProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
    page.current += 1;
  };

  const renderProduct = (product: TProduct) => (
    <MemoProduct key={UID().generate()} {...product} branchId={branchId} />
  );

  return (
    <View>
      <CategoryHeader name={name} />
      {categoryProducts.map(renderProduct)}
      {/* <LoadMoreButton onPress={async () => await getMoreProducts()} name={name} /> */}
    </View>
  );
}

const CategoryHeader = ({ name }: { name: string }) => (
  <View style={styles.categoryHeader}>
    <ThemedText>{name}</ThemedText>
  </View>
);

export const LoadMoreButton = ({ onPress, name }: { onPress: () => Promise<void>, name: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const onButtonPress = async () => {
    setIsLoading(true);
    await onPress();
    setIsLoading(false);
  };
  return (
    <Pressable onPress={onButtonPress} style={styles.loadMoreButton}>
      {isLoading && <LoadingIndicator />}
      {
        !isLoading && <ThemedText type="defaultSemiBold" numberOfLines={1} ellipsizeMode="tail">
          Show more...
        </ThemedText>
      }
    </Pressable>
)};

export const MemoCategory = memo(Category);

const styles = StyleSheet.create({
  categoryHeader: {},
  loadMoreButton: {
    marginBottom: 24,
    borderWidth: 1,
    borderBottomWidth: 3,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
