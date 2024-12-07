import { TProduct, useCatalog } from "@/hooks/useCatalog";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedView } from "./ThemedView";
import Category, { LoadMoreButton } from "./Category";
import UID from "@/util/UID";
import React, { useEffect, useRef, useState } from "react";
import CenteredText from "./CenteredText";
import { useLocalSearchParams } from "expo-router";
import ProductsAPI from "@/apis/ProductsAPI";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

export type CatalogProps = {
  branchId: string,
};

const productsApi = ProductsAPI();

export default function Catalog () {
  const { branchId } = useLocalSearchParams();
  const { catalog, isLoading, loadMoreProducts } = useCatalog(branchId.toString()); 
  const [ categories, setCategories ] = useState<string[]>([]);
  const [ selectedCategory, setSelectedCategory ] = useState<string>('');
  const page = useRef<number>(2);

  useEffect(() => {
    productsApi.getProductsCategories(branchId.toString()).then((categories: string[]) => {
      setCategories(categories);
    });
  }, []);

  if (isLoading) return <LoadingIndicator loadingText="Loading Catalog..."/>
  return (
    <ThemedView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}  >
        <Pressable style={selectedCategory != '' ? styles.categoryButton : styles.categoryButtonSelected} key={UID().generate()} onPress={() => setSelectedCategory('')}>
          <ThemedText type="defaultSemiBold">All</ThemedText>
        </Pressable>
        {
          categories.map((categoryName) => (
            <Pressable 
              style={
                selectedCategory === categoryName 
                ? styles.categoryButtonSelected 
                : styles.categoryButton
              } 
              key={UID().generate()} 
              onPress={() => {
                setSelectedCategory(categoryName);
                page.current = 2;
              }}>
              <ThemedText type="defaultSemiBold">{categoryName}</ThemedText>
            </Pressable>
          ))
        }
      </ScrollView>
      {
        selectedCategory != "" 
          ? <Category key={UID().generate()} name={selectedCategory} products={catalog[selectedCategory]}/>
          : Object.entries(catalog).map(([category, products]) => 
          <Category key={UID().generate()} name={category} products={products} />
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

const styles = StyleSheet.create({
  categoryButton: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});