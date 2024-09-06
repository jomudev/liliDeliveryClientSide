import databaseAPI from "@/apis/databaseAPI";
import LoadingIndicator from "@/components/LoadingIndicator";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ParallaxViewHeader from "@/components/ParallaxViewHeader";
import { ThemedText } from "@/components/ThemedText";
import { TBusiness } from "@/contexts/businessCtx";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Image } from "@/components/Image";
import Catalog from "@/components/Catalog";
import { ThemedView } from "@/components/ThemedView";

export function useBusinessInfo(businessId: string) {
  const [businessInfo, setBusinessInfo] = useState<TBusiness | null>();
  useEffect(() => {
    (async function () {
      console.log(`requesting business "${businessId}" info`)
      const apiResponse = await databaseAPI().getBusinessInfo(businessId);
      setBusinessInfo(apiResponse);
    })();
  }, []); 
  return businessInfo;
}

export default function businessCatalog() {
  const { businessId } = useLocalSearchParams();
  const businessInfo = useBusinessInfo(businessId);
  if (!businessInfo) return <LoadingIndicator />;
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFE37E', dark: '#FF7D70' }}
      headerImage={
        <Image 
          src={businessInfo.imageURL} 
          style={styles.headerImage}
          />
      }
      headerContent={ 
        <ParallaxViewHeader 
          title={`🏬 ${businessInfo.name}`} 
          subtitle={`✨ ${businessInfo.description}`}
          lightColor='white'
          darkColor='white'
          />
      }
      >
        <ThemedView style={styles.container}>
          <ThemedText> {businessInfo.name}'s Catalog goes here</ThemedText>
          <Catalog businessId={businessId} />
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    top: 0,
    left: 0,
    height: '100%',
    position: 'absolute',
  },
});