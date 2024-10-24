import { TProduct } from "@/hooks/useCatalog";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import Product from "./Product";
import UID from "@/util/UID";
import { OrderContext } from "@/contexts/orderCtx";
import { memo, useContext } from "react";
import React from "react";
import { TComplement } from "@/app/(app)/addComplement";

export type CategoryProps = {
  branchId: string;
  name: string;
  products: TProduct[];
};

const MemoProduct = memo(Product);
export default function Category ({ branchId, name, products}: CategoryProps) {
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
            branchId={branchId}
          />
        ))
      }
    </ThemedView>
  )
};

export const MemoCategory = memo(Category);

const styles = StyleSheet.create({
  categoryHeader: {},
});