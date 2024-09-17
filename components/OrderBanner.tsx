import { useContext } from "react";
import BlurView from "./BlurView";
import { OrderContext } from "@/contexts/orderCtx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Link, usePathname } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function OrderBanner () {
  const { order } = useContext(OrderContext);
  const pathname = usePathname();
  const theme = useColorScheme() ?? 'light';
  if (pathname == '/orders') return null;
  if (order.length == 0) return null;
  return (
    <View style={styles.container}>
      <Link asChild href={'/(app)/(tabs)/orders'}>
        <BlurView tint={theme == 'light' ? 'dark' : 'light'} style={styles.banner}>
            <ThemedText darkColor="white" lightColor="white"> 
              You have a pending order 
            </ThemedText>
            <Link style={styles.viewCartButton} href={'/(app)/(tabs)/orders'} >
              <ThemedText darkColor="white" lightColor="white"> 
                View Cart
              </ThemedText>
              <MaterialCommunityIcons name='cart-outline' size={24} color={'white'} style={{ textAlign: 'center', textAlignVertical: 'center'}} />
            </Link>
          </BlurView>
      </Link>
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