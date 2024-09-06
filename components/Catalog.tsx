import { useCatalog } from "@/hooks/useCatalog";
import { ThemedText } from "./ThemedText";
import LoadingIndicator from "./LoadingIndicator";
import { Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Button } from "@rneui/base";

export type CatalogProps = {
  businessId: string,
};



export default function Catalog ({ businessId}: CatalogProps) {
  const { catalog, isLoading } = useCatalog(businessId);
  if (isLoading) return <LoadingIndicator />
  if (Object.keys(catalog).length == 0) return (
    <Link asChild href='/(app)/(tabs)'>
      <Button> 
        <ThemedText>Go Back</ThemedText> 
      </Button>
    </Link>
  )
  return <ThemedText>{ JSON.stringify(catalog, null, 2) }</ThemedText>
};