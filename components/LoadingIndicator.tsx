import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, StyleSheet, Image } from "react-native";
import { ThemedView } from "./ThemedView";
import React from "react";
import CenteredText from "./CenteredText";

export type TLoadingIndicatorProps = {
  loadingText?: string;
};

export default function LoadingIndicator ({ loadingText }: TLoadingIndicatorProps) {
  const theme = useColorScheme() ?? 'light';
  return (
    <ThemedView style={[styles.loadingModal]}>
      {
        loadingText && <CenteredText>{loadingText}</CenteredText>
      }
      <ActivityIndicator size={32} color={theme == 'light' ? '#A984D9' : '#FFE37E'} />
    </ThemedView>
  )
};
const styles = StyleSheet.create({
  loadingModal: {
    position: 'absolute',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
});