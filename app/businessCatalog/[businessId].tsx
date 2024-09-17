import databaseAPI from "@/apis/databaseAPI";
import LoadingIndicator from "@/components/LoadingIndicator";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ParallaxViewHeader from "@/components/ParallaxViewHeader";
import { TBusiness } from "@/contexts/businessCtx";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Image } from "@/components/Image";
import Catalog from "@/components/Catalog";
import { ThemedView } from "@/components/ThemedView";

export function useBusinessInfo(businessId: number) {
  const [businessInfo, setBusinessInfo] = useState<TBusiness | null>();
  useEffect(() => {
    (async function () {
      const apiResponse = await databaseAPI().getBusinessInfo(businessId);
      setBusinessInfo(apiResponse);
    })();
  }, []); 
  return businessInfo;
}

export default function businessCatalog() {
  const { businessId }: { businessId: string } = useLocalSearchParams();
  const businessInfo = useBusinessInfo(parseInt(businessId));

  if (!businessInfo) return <LoadingIndicator />;
  return (
    <ParallaxScrollView
      showBackButton
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
          subtitle={Boolean(businessInfo.description) ? `✨ ${businessInfo.description}` : ''}
          lightColor='white'
          darkColor='white'
          />
      }
      >
        <ThemedView style={styles.container}>
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