import { StyleSheet, Pressable } from "react-native";
import { Image } from '@/components/Image';
import { ThemedText } from "./ThemedText";
import BlurView from "@/components/BlurView";
import { ThemedView } from "./ThemedView";
import toCurrency from "@/util/toCurrency";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { TBusiness } from "@/contexts/businessCtx";

export type BusinessCardProps = TBusiness;

export default function BranchCard ({
  id,
  businessId,
  name,
  description,
  averageDeliveryTime,
  deliveryPrice,
  imageURL,
}: BusinessCardProps) {

  return (
    <Link asChild href={{
      pathname: `/(app)/(tabs)/(explore)/branchScreen`,
      params: {
        branchId: id,
      }
    }} >
      <Pressable 
        style={styles.container}>
        <Image src={imageURL} style={styles.backgroundImage}/>
          <ThemedView style={styles.businessDescription}>
            <ThemedText style={styles.businessName} type='title' lightColor="white" darkColor="white" >
              { name }
            </ThemedText>
            <ThemedText style={styles.businessSlogan} lightColor="white" darkColor="white" >
              { description }
            </ThemedText>
          </ThemedView>
        {/* <BlurView intensity={60} tint={'dark'} style={[styles.businessDetails, styles.averageDeliveryTime]}>
          <ThemedText style={styles.averageDeliveryTimeText} lightColor="white" darkColor="white">
            { averageDeliveryTime } min
          </ThemedText>
          <ThemedText>
            •
          </ThemedText>
          <ThemedText style={styles.deliveryPriceText} lightColor="white" darkColor="white">
            { toCurrency(deliveryPrice) }
          </ThemedText>
        </BlurView> */}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 160,
    padding: 0,
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    margin: 0,
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  businessName: {
    textAlign: 'center',
    height: 35,
    fontSize: 24,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  businessSlogan: {
    textAlign: 'center',
    height: 30,
    fontSize: 12,
    textShadowColor: "#000",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
  },
  businessDescription: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  businessDetails: {
    position: 'absolute',
    width: 'auto',
    minWidth: 50,
    flexDirection: 'row',
    gap: 4,
    minHeight: 50,
    bottom: 8,
    alignItems: 'center',
    borderRadius: 18,
    padding: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 8,
    }
  },
  averageDeliveryTime: {
    left: 8,
  },
  deliveryPrice: {
    right: 8,
  },
  averageDeliveryTimeText: {
    fontSize: 16, 
    textAlignVertical: 'center',
  },
  deliveryPriceText: {
    fontSize: 16,
    textAlignVertical: 'center',
  },
  deliveryTimeIcon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
});