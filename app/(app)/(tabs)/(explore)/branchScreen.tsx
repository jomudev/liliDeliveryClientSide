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
import React from "react";

export function useBranchInfo(branchId: number) {
  const [branchInfo, setBusinessInfo] = useState<TBusiness | null>();
  useEffect(() => {
    (async function () {
      const apiResponse = await databaseAPI().getBusinessInfo(branchId);
      setBusinessInfo(apiResponse);
    })();
  }, [branchId]); 
  return branchInfo;
}

export default function businessCatalog() {
  const { branchId }: { branchId: string } = useLocalSearchParams();
  const branchInfo = useBranchInfo(parseInt(branchId));

  if (!branchInfo) return <LoadingIndicator />;

  return (
    <ParallaxScrollView
      showBackButton
      headerBackgroundColor={{ light: '#FFE37E', dark: '#FF7D70' }}
      headerImage={
        <Image 
          src={branchInfo.imageURL} 
          style={styles.headerImage}
          />
      }
      headerContent={ 
        <ParallaxViewHeader 
          title={`🏬 ${branchInfo.name}`} 
          subtitle={Boolean(branchInfo.description) ? `✨ ${branchInfo.description}` : ''}
          lightColor='white'
          darkColor='white'
          />
      }
      >
        <ThemedView style={styles.container}>
          <Catalog branchId={branchId} />
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