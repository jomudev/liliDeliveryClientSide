import { ReactElement } from "react";
import { ThemedText, ThemedTextProps } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { StyleSheet, ViewProps } from 'react-native';
import BlurView from "./BlurView";

export type ParallaxViewHeaderProps = ViewProps & ThemedTextProps & {
  title?: string,
  subtitle?: string,
};

export default function ParallaxViewHeader ({ title, subtitle, ...otherProps }: ParallaxViewHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <BlurView intensity={30} tint={'dark'} style={styles.headerTitles}>
        { title && (
          <ThemedText 
            type='defaultSemiBold'
            darkColor={otherProps.darkColor}
            lightColor={otherProps.lightColor}
            > 
              { title }
          </ThemedText>
        )}
        { subtitle && (
          <ThemedText  
            darkColor={otherProps.darkColor}
            lightColor={otherProps.lightColor}
            > 
              { subtitle }
          </ThemedText>
        )}
        { otherProps.children }
      </BlurView>
    </ThemedView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    position: 'absolute',
    padding: 16,
    width: '100%',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 40
    },
    elevation: 3,
    shadowRadius: 0.17
  },
});