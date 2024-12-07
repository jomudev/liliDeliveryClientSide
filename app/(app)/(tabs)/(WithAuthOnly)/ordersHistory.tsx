import databaseAPI from "@/apis/databaseAPI";
import CenteredText from "@/components/CenteredText";
import HistoryOrderListItem from "@/components/Order/HistoryOrderListItem";
import StyledLink from "@/components/StyledLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "@/contexts/authCtx";
import { TProduct } from "@/hooks/useCatalog";
import { Stack } from "expo-router";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { ScrollView } from "react-native";

export type PendingOrder = {
  id: string,
  total: number,
  userId: string,
  branchId: string,
  address: string,
  branchName: string,
  products: TProduct[],
  date: string,
};

export function usePendingOrders() {
  const { user } = useContext(AuthContext);
  const [ordersHistory, setOrdersHistory] = useState<PendingOrder[]>([]);

  const getOrders = useCallback(async () => {
    let orders = await databaseAPI().getPendingOrders(user?.uid || '');
    orders = orders || [];
    setOrdersHistory(orders);
  }, []);

  useEffect(() => {
    getOrders();
  }, []);

  return {
    ordersHistory,
  };
}

export default function PendingOrdersScreen() {
  const { ordersHistory } = usePendingOrders();
  if (ordersHistory.length < 1) {
    return (
      <>
        <Stack.Screen options={{ headerBackTitle: 'Back', headerTitle: 'Orders History' }} /> 
        <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <CenteredText>🤷🏻 No orders yet</CenteredText>
          <StyledLink href={'/(app)/(tabs)'}>
            🏬 Go to Business Screen
          </StyledLink>
        </ThemedView>
      </>
    )
  }
  return (
    <>
      <Stack.Screen options={{ headerBackTitle: 'Back', headerTitle: 'Orders History' }} /> 
      <ThemedView style={{ flex: 1 }}>
        <ScrollView>
          {
            ordersHistory.reverse().map((order, index) => (
              <HistoryOrderListItem 
              key={index} 
              {...order}
              />
            ))
          }
        </ScrollView>
      </ThemedView>
    </>
  );
}

function callBack() {
  throw new Error("Function not implemented.");
}
