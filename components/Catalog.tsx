import { useCatalog } from "@/hooks/useCatalog";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedView } from "./ThemedView";
import Category from "./Category";
import { ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";

export type CatalogProps = {
  businessId: string,
};

export default function Catalog ({ businessId}: CatalogProps) {
  const { catalog, categoryId, isLoading } = useCatalog(businessId);
  if (isLoading) return <LoadingIndicator />
  return (
    <ThemedView>
      <ScrollView style={{ flexDirection: 'row', marginBottom: 24}} horizontal>
        {
          Object.keys(catalog).length > 1 ? Object.keys(catalog).map((categoryName) => (
            <ThemedText>{ categoryName }</ThemedText>
          )) : <ThemedText> 😨 No Products Here </ThemedText>
        }
      </ScrollView>
      {
        Object.keys(catalog).map((category: string) => (
          <ThemedView key={categoryId[category]}>
            <Category name={category} products={catalog[category]}/>
          </ThemedView>
        ))
      }
     </ThemedView>
    )
};