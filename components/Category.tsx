import { TProduct } from "@/hooks/useCatalog";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import Product from "./Product";
import UID from "@/util/UID";

export type CategoryProps = {
  name: string;
  products: TProduct[];
};
export default function Category ({ name, products}: CategoryProps) {
  return (
    <ThemedView>
      <ThemedView style={styles.categoryHeader}>
        <ThemedText>{ name }</ThemedText>
      </ThemedView>
      {
        products.map(product => <Product key={UID().generate()} name={product.name} description={product.description} price={product.price} imageURL={product.imageURL} /> )
      }
    </ThemedView>
  )
};

const styles = StyleSheet.create({
  categoryHeader: {},
});