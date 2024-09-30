import BlurView from "./BlurView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Link, usePathname } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TOrderProduct } from "@/hooks/useOrders";
import { useState } from "react";

export type OrderBannerProps = {
  order: TOrderProduct[],
}

export default function OrderBanner ({ order }: OrderBannerProps) {
  const [ showBanner, setShowBanner ] = useState(true);
  const pathname = usePathname();
  const theme = useColorScheme() ?? 'light';
  if (pathname == '/orders') return null;
  if (order.length == 0) return null;
  if (!showBanner) {
    return (
      <View style={styles.container}>
        <BlurView 
          tint={theme == 'light' ? 'dark' : 'light'} 
          style={[styles.banner, { 
            width: 72, 
            height: 72, 
            justifyContent: 'center', 
            left: 20
          }]}
          >
          <Pressable onPress={() => setShowBanner(true) }>
            <Ionicons name='chevron-forward' color={'white'} size={24} />
          </Pressable>
        </BlurView>
      </View>
    )
  }
  return (
    <View style={styles.container}>
        <BlurView tint={theme == 'light' ? 'dark' : 'light'} style={styles.banner}>
            <Pressable 
              style={{ flexDirection: 'row', alignItems: 'center'}} 
              onPress={() => setShowBanner(false) }
              >
              <Ionicons name='chevron-back' color={'white'} size={24} />
              <ThemedText darkColor="white" lightColor="white"> 
                You have a pending order 
              </ThemedText>
            </Pressable>
            <Link style={styles.viewCartButton} href={'/(app)/(tabs)/orders'} >
              <ThemedText style={{ textAlignVertical: 'center'}}>
                <ThemedText darkColor="white" lightColor="white"> 
                  View Cart
                </ThemedText>
                <MaterialCommunityIcons name='cart-outline' size={16} color={'white'} />
              </ThemedText>
            </Link>
          </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    position: 'absolute',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    width: '90%',
    elevation: 16,
    bottom: Platform.OS == 'android' ? 54 : 80,
  },
  viewCartButton: {
    backgroundColor: 'black',
    height: '100%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    overflow: 'hidden'
  },
});