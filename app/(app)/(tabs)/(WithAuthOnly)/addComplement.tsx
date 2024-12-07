import databaseAPI from "@/apis/databaseAPI";
import BlurView from "@/components/BlurView";
import { Image } from "@/components/Image";
import LoadingIndicator from "@/components/LoadingIndicator";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ParallaxViewHeader from "@/components/ParallaxViewHeader";
import Row from "@/components/Row";
import StyledButton from "@/components/StyledButton";
import { ThemedText } from "@/components/ThemedText";
import { OrderContext } from "@/contexts/orderCtx";
import { TProduct } from "@/hooks/useCatalog";
import feedback from "@/util/feedback";
import imageOf from "@/util/imageOf";
import toCurrency from "@/util/toCurrency";
import toJSON from "@/util/toJSON";
import UID from "@/util/UID";
import { CheckBox } from "@rneui/themed";
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type TComplement = {
  id: number,
  name: string,
  type: number,
  category: string,
  value: number,
}

export type TGroupedComplements = {
  category: string,
  complements: TComplement[],
}

export const emptyGroupedComplements: TGroupedComplements = {
  category: 'string',
  complements: [],
};

const initSelectedComplements = (complementsGroups: TGroupedComplements[]) => {
  return complementsGroups.reduce((prev: TComplement[], current) => {
    current.complements.forEach((complement: TComplement) => {
      if (complement.type != 1 || prev.length > 0) return;
      prev.push(complement);
    });
    return prev;
  }, [])

}; 

export default function AddComplementsScreen() {
  const { addProductToOrder } = useContext(OrderContext);
  const [complements, setComplements] = useState<TGroupedComplements[]>([]);
  const { productId, branchId } = useLocalSearchParams();
  const [ productData, setProductData ] = useState<TProduct | null>(null);
  const [ selectedComplements, setSelectedComplements ] = useState<TComplement[]>([]);
  const [ loading, setLoading ] = useState<Boolean>(true);
  const navigation = useNavigation();
  
  useEffect(() => {
    (async function() {
      let productData: TProduct | null = await databaseAPI().getProduct(productId.toString()) || null;
      setProductData(productData);
      let fetchedComplements: TGroupedComplements[] = await databaseAPI().getProductComplements(productId.toString()) || []; 
      setComplements(fetchedComplements); 
      setSelectedComplements(initSelectedComplements(fetchedComplements));
      setLoading(false);
    })();
  }, [productId]);

  
  function complementIsSelected(complement: TComplement) {
    return Boolean(selectedComplements.find((selectedComplement) => selectedComplement.id == complement.id));
  };
  
  function handleSelectComplement(complement: TComplement) {
    if (complement.type == 1) {
      if (selectedComplements.find((selectedComplement) => selectedComplement.id == complement.id)) {
        return;
      }
      if (selectedComplements.find((selectedComplement) => selectedComplement.type == 1 && selectedComplement.category == complement.category)) {
        return setSelectedComplements(
          selectedComplements.filter(
            (selectedComplement) => selectedComplement.category != complement.category
          ).concat(complement)
        );
      }
    }
    if (selectedComplements.find((selectedComplement) => selectedComplement.id == complement.id)) {
      return setSelectedComplements(selectedComplements.filter((selectedComplement) => selectedComplement.id != complement.id));
    }
    setSelectedComplements(selectedComplements.concat(complement));
  }
  
  function handleFinishOrder() {
    setLoading(true);
    if (!productData) {
      feedback('Imposible to add order, please contact support');
      console.log('cannot add order, product data is null');
      return;
    }
    addProductToOrder({
      ...productData,
      id: productId.toString(),
      branchId: branchId.toString(),
      complements: selectedComplements,
      quantity: 1,
    });
    setTimeout(() => router.back(), 300);
  }
  
  if (loading) return <LoadingIndicator loadingText="Loading Side Dishes..." />;
  if (!productData) return <LoadingIndicator />;
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ParallaxScrollView 
        headerImage={productData?.imageURL || ''} 
        showBackButton={true}
        headerBackgroundColor={{
        dark: "#3d3d3d",
        light: "#dedede"

      }}>
        <ThemedText type='title'>
          { productData.name }
        </ThemedText>
        <ThemedText type='subtitle'>
          { productData.description }
        </ThemedText>
        {
          complements.length > 1 && (
            <ThemedText type='defaultSemiBold'>
              Select a Side Dish 
            </ThemedText>
          )
        }
        { 
          complements.map((complementGroup: TGroupedComplements) => (
            <View key={UID().generate()}>
              <ThemedText>{ complementGroup.category }</ThemedText>
              {
                complementGroup.complements.map((complement: TComplement) => (
                  (
                    <Row key={UID().generate()} style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <View>
                        {
                          complement.type == 1 ? (
                            <CheckBox 
                              onPress={() => handleSelectComplement(complement)}
                              checked={complementIsSelected(complement)} 
                              checkedIcon="dot-circle-o"
                              uncheckedIcon="circle-o" 
                              />
                          ) : (
                            <CheckBox 
                              onPress={() => handleSelectComplement(complement)}
                              checked={complementIsSelected(complement)} 
                              iconType="material-community"
                              checkedIcon="checkbox-marked"
                              uncheckedIcon="checkbox-blank-outline"
                              checkedColor="red"
                              />
                          )
                        }
                      </View>
                      <ThemedText>
                        { complement.name }
                      </ThemedText>
                      <ThemedText >
                        { complement.value > 0 ? `+ ${toCurrency(complement.value)}` : 'Free' }
                      </ThemedText>
                    </Row>
                  )
                ))
              }
            </View>
          ))
        }
        <StyledButton onPress={() => handleFinishOrder()} >
          Add to Order
        </StyledButton>
      </ParallaxScrollView>
    </>
  );
}

export type ComplementProps = {
  name: string,
  price: number,
  category: string,
  imageURL?: string,
  selected: boolean,
  onPress: () => void,
}

export function Complement({ 
  name,
  price,  
  category,
  selected,
  imageURL,
  onPress,
 }: ComplementProps) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    (async function() {
      setSrc(await imageOf(name));
    })();
  }, []);
  return (
    <Pressable onPress={onPress} style={{
      alignItems: 'center',
      justifyContent: 'center',
      margin: 4,
      padding: 4,
      width: 100,
      borderRadius: 8,
      backgroundColor: selected ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
    }}>
      <Image src={imageURL || src} style={{
        width: 60,
        height: 60,
        borderRadius: 30,
      }} />
      <ThemedText>{ name }</ThemedText>
    </Pressable >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  complementImage: {
    width: 100,
    height: 100,
  },
  productImage: {
    width: '100%',
    height: 300,
  }
}); 
