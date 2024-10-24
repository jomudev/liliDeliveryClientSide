import { useCatalog } from "@/hooks/useCatalog";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedView } from "./ThemedView";
import Category from "./Category";
import { ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";
import UID from "@/util/UID";
import React from "react";

export type CatalogProps = {
  branchId: string,
};

export default function Catalog ({ branchId }: CatalogProps) {
  const { catalog, categoryId, isLoading } = useCatalog(branchId);
  if (isLoading) return <LoadingIndicator />
  return (
    <ThemedView>
      <ScrollView style={{ flexDirection: 'row', marginBottom: 24}} horizontal>
        {
          Object.keys(catalog).length > 1 && Object.keys(catalog).map((categoryName) => (
            <ThemedText key={UID().generate()}>{ categoryName }</ThemedText>
          ))
        }
      </ScrollView>
      {
        Object.keys(catalog).map((category: string) => (
          <ThemedView key={categoryId[category]}>
            <Category name={category} branchId={branchId} products={catalog[category]}/>
          </ThemedView>
        ))
      }
      {
        !Boolean(Object.keys(catalog).length) && <ThemedText> 😨 No Products Here </ThemedText>
      }
     </ThemedView>
    )
};