import databaseAPI from "@/apis/databaseAPI";
import Button from "@/components/Button";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import feedback from "@/util/feedback";
import { LinearProgress } from "@rneui/themed";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CenteredText from "@/components/CenteredText";

const ORDER_STATES = [
  'Cancel Order',
  'Waiting for business confirmation...',
  'Waiting for pickup', 
  'Waiting for pickup',
  'Your order is on the way 🚚. Please wait ⏳.',
  'Order Again',
  'Order Again',
] as const;

const STATUSES_DESCRIPTION = [
  'The order is currently undergoing verification 🔄. Please wait patiently ⏳. If you need to cancel the order, press the "CANCEL ORDER" button ❌.', 
  'Waiting for business to confirm the order 🏬. Please wait ⏳.', 
  'The order is currently waiting for pickup 🚚. Please wait ⏳.', 
  'The order is currently waiting for pickup 🚚. Please wait ⏳.', 
  'You can track the location of your order 🗺️.',
] as const;

interface OrderData {
  status: number;
  latitude: number;
  longitude: number;
  address: string;
  idBranches: string;
  timeOrder?: number;
}

export default function OrderStateScreen() {
  const { orderId } = useLocalSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useColorScheme() ?? 'light';

  const handleGetOrderData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await databaseAPI().getOrderData(orderId.toString());
      if (!data) throw new Error('No data');
      setOrderData({
        ...data,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      });
    } catch (error) {
      feedback('😨 Error fetching order data');
      console.error('Order fetch error:', error);
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    handleGetOrderData();
  }, [handleGetOrderData]);

  if (isLoading) return <LoadingIndicator loadingText="Getting Order Data..." />;
  if (!orderData) return null;

  const statusIndex = orderData.status - 1;
  const progressValue = orderData.status / 6;
  const isIndeterminate = orderData.status < 2;

  return (
    <>
      <Stack.Screen options={{ headerBackTitle: 'Back', headerTitle: 'Order State' }} />
      <ThemedView style={styles.container}>
        <OrderStatus statusIndex={statusIndex} />
        <OrderProgress theme={theme} progressValue={progressValue} isIndeterminate={isIndeterminate} timeOrder={orderData.timeOrder} />
        <OrderMap orderData={orderData} />
        <ExploreButton />
      </ThemedView>
    </>
  );
}

function OrderStatus({ statusIndex }: { statusIndex: number }) {
  return (
    <>
      <ThemedText type="title">{ORDER_STATES[statusIndex]}</ThemedText>
      <ThemedText type="subtitle">{STATUSES_DESCRIPTION[statusIndex]}</ThemedText>
    </>
  );
}

function OrderProgress({ theme, progressValue, isIndeterminate, timeOrder }: { theme: string, progressValue: number, isIndeterminate: boolean, timeOrder?: number }) {
  return (
    <>
      <ThemedText type="defaultSemiBold">Progress:</ThemedText>
      <LinearProgress
        style={styles.progress(theme)}
        trackColor={Colors[theme].background}
        value={progressValue}
        variant={isIndeterminate ? 'indeterminate' : 'determinate'}
        color={Colors[theme].primary}
      />
      <CenteredText>Approximated time: {timeOrder ?? 'N/A'} min</CenteredText>
    </>
  );
}

function OrderMap({ orderData }: { orderData: OrderData }) {
  return (
    <>
      <ThemedText type="defaultSemiBold">Destination:</ThemedText>
      <ThemedText>{orderData.address}</ThemedText>
      <MapView
        initialRegion={{
          latitude: orderData.latitude,
          longitude: orderData.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        style={styles.map}
      >
        <Marker
          title="Delivery Location"
          coordinate={{
            latitude: orderData.latitude,
            longitude: orderData.longitude,
          }}
        />
      </MapView>
    </>
  );
}

function ExploreButton() {
  return (
    <Button onPress={() => router.navigate('/(app)/(explore)')}>
      <ThemedText type="subtitle" lightColor={Colors['dark'].text} darkColor={Colors['dark'].text}>
        Go to Explore
      </ThemedText>
    </Button>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  progress: (theme: string) => ({
    borderColor: Colors[theme].primary,
    borderWidth: 2,
    height: 20,
    borderRadius: 24,
  }),
  map: {
    width: '100%',
    height: 200,
  },
};
