import { useCatalog } from "@/hooks/useCatalog";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedView } from "./ThemedView";
import Category, { LoadMoreButton } from "./Category";
import UID from "@/util/UID";
import React, { useRef } from "react";
import CenteredText from "./CenteredText";
import { useLocalSearchParams } from "expo-router";
import ProductsAPI from "@/apis/ProductsAPI";

export type CatalogProps = {
  branchId: string,
};

export default function Catalog () {
  const { branchId } = useLocalSearchParams();
  const { catalog, isLoading, loadMoreProducts } = useCatalog(branchId.toString()); 
  const page = useRef(2);

  if (isLoading) return <LoadingIndicator />
  return (
    <ThemedView>
       {
        Object.entries(catalog).map(([category, products]) => 
          <Category key={UID().generate()} name={category} products={products}/>
        )
       }
      {
        !Boolean(Object.keys(catalog).length) && <CenteredText> 😨 No Products Here </CenteredText>
      }
      <LoadMoreButton 
        onPress={
          async () => 
            page.current = await loadMoreProducts(branchId.toString(), page.current)
          } 
          />
     </ThemedView>
    )
};