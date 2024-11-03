import { Pressable, View } from "react-native";
import { ThemedText } from "../ThemedText";
import toCurrency from "@/util/toCurrency";
import React from "react";
import { StyleSheet } from "react-native";
import { TProduct } from "@/hooks/useCatalog";
import UID from "@/util/UID";
import { Image } from "../Image";
import Row from "../Row";
import { router, useNavigation } from "expo-router";

// CONSTANTS
const STATUSES: {
  [index: string]: string,
} = {
  '1': '💳 Waiting for payment',
  '2': '⚙️ Processing',
  '3': '⏳ Waiting for Business Confirmation',
  '4': '✅ Confirmed',
  '5': '🚀 On Way',
  '6': '📦 Delivered',
  '7': '😎 Waiting for reordering',
}

const BUTTON_TEXT: {
  [index: string]: string,
} = {
  '1': 'Cancel Order',
  '2': 'In Process...',
  '3': 'In Process...',
  '4': 'View Order State',
  '5': 'View Order State',
  '6': 'Order Again',
  '7': 'Order Again',
};


export type HistoryOrderListItemProps = {
  id: string,
  branchName: string,
  products: TProduct[],
  date: string,
  total: number,
  status: string,
}

export default function HistoryOrderListItem ({
  id,
  branchName,
  products,
  date,
  total,
  status,
}: HistoryOrderListItemProps) {

  function handleViewOrderState() {
    let NumberStatus = Number(status);
    if (NumberStatus < 2) {
      alert('Module not available yet');
    } else {
      console.log('pushing to orderStateScreen', id);
      router.push("/(app)/orderStateScreen");
      router.setParams({
        orderId: id,
      }) 
    }
  }

  return (
    <Row style={styles.container}>
      <View>
        <Row style={{ justifyContent: 'space-between', width: '100%'}}>
          <View>
            <ThemedText type="subtitle">{ branchName }</ThemedText>
          </View>
          <View>
            <ThemedText type="subtitle">{ toCurrency(total) }</ThemedText>
          </View>
        </Row>
        <ThemedText>{ new Date(date).toLocaleString() }</ThemedText>
        <Row style={{ overflow: 'hidden'  }}>
          {
            products && products.map(({ imageURL }) => (
              <View 
                key={UID().generate()} 
                style={{ 
                  width: 40, 
                  height: 40, 
                }} >
                <Image src={imageURL} style={{ height: 40, width: 40, borderRadius: 30, left: 8}} />
              </View>
            ))
          }
        </Row>
      </View>
      <HistoryOrderButton orderStatus={status} onPress={() => handleViewOrderState()}  />
    </Row>
  );
}

export type HistoryOrderButtonProps = {
  orderStatus: string,
  onPress?: () => void,
};

export function HistoryOrderButton({ orderStatus, onPress }: HistoryOrderButtonProps) {
  return (
    <Pressable style={styles.orderHistoryButton} onPress={() => onPress && onPress()}>
      <ThemedText type="subtitle" darkColor="white" lightColor="white">
        { BUTTON_TEXT[orderStatus] }
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container:  {
    paddingBottom: 48,
    padding: 24,
    alignItems: 'flex-end',

  },
  orderHistoryButton: {
    padding: 16,
    height: 60,
    backgroundColor: 'black',
    borderColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    position: 'absolute',
    right: 16,
  },
});