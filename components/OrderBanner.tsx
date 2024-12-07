import React from "react";
import BlurView from "./BlurView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform, Pressable, StyleSheet, View, Animated } from "react-native";
import { ThemedText } from "./ThemedText";
import { Link, usePathname } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TOrderProduct } from "@/hooks/useOrders";
import { useState, useRef } from "react";

export type OrderBannerProps = {
  order: TOrderProduct[];
};

export default function OrderBanner({ order }: OrderBannerProps) {
  const [showBanner, setShowBanner] = useState(true);
  const pathname = usePathname();
  const theme = useColorScheme() ?? "light";
  const slideAnim = useRef(new Animated.Value(1)).current;

  if (pathname === "/orders" || "/login" || order.length === 0) return null;

  const toggleBanner = () => {
    Animated.timing(slideAnim, {
      toValue: showBanner ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowBanner(!showBanner));
  };

  return (
    <View style={styles.container}>
      <BlurView
        tint={theme === "light" ? "dark" : "light"}
        style={[styles.banner, showBanner ? styles.fullBanner : styles.miniBanner]}
      >
        <ToggleBannerButton showBanner={showBanner} onPress={toggleBanner} />
        {showBanner && <CartButton />}
      </BlurView>
    </View>
  );
}

function ToggleBannerButton({ showBanner, onPress }: { showBanner: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={showBanner ? styles.bannerContent : styles.iconOnly}
      accessibilityLabel="Toggle order banner"
      accessible
    >
      <Ionicons
        name={showBanner ? "chevron-back" : "chevron-forward"}
        color="white"
        size={24}
      />
      {showBanner && (
        <ThemedText darkColor="white" lightColor="white" style={styles.bannerText}>
          You have a pending order
        </ThemedText>
      )}
    </Pressable>
  );
}

function CartButton() {
  return (
    <Link
      style={styles.viewCartButton}
      href="/(app)/(tabs)/orders"
      accessibilityLabel="View your cart"
      accessible
    >
      <MaterialCommunityIcons name="cart-outline" size={16} color="white" />
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    width: "90%",
    elevation: 16,
    padding: 8,
    bottom: Platform.OS === "android" ? 54 : 80,
  },
  fullBanner: {
    justifyContent: "space-between",
  },
  miniBanner: {
    width: 72,
    height: 72,
    justifyContent: "center",
    left: 20,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconOnly: {
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    marginLeft: 8,
    fontSize: 16,
  },
  viewCartButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cartButtonText: {
    color: "white",
    marginRight: 8,
    fontSize: 16,
  },
});
