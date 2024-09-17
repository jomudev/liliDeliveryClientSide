import { TProduct } from "@/hooks/useCatalog";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import Product from "./Product";
import UID from "@/util/UID";
import { OrderContext } from "@/contexts/orderCtx";
import { memo, useContext } from "react";

export type CategoryProps = {
  name: string;
  products: TProduct[];
};

const MemoProduct = memo(Product);
export default function Category ({ name, products}: CategoryProps) {
  const { addProductToOrder} = useContext(OrderContext);
  return (
    <ThemedView>
      <ThemedView style={styles.categoryHeader}>
        <ThemedText>{ name }</ThemedText>
      </ThemedView>
      {
        products.map((product: TProduct) => (
          <Product 
            key={UID().generate()} 
            {...product}
            handleAddToCart={() => addProductToOrder({
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: 1,
              imageURL: product.imageURL,
              businessId: product.businessId,
              branchId: product.branchId,
            })}
            />
        ) )
      }
    </ThemedView>
  )
};

export const MemoCategory = memo(Category);

const styles = StyleSheet.create({
  categoryHeader: {},
});