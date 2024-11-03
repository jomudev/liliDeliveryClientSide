import type { PropsWithChildren, ReactElement } from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { Icon } from '@rneui/themed';
import { Colors } from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import BlurView from './BlurView';
import { Image } from './Image';
import React from 'react';
import { ThemedText } from './ThemedText';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement | string;
  noScroll?: boolean;
  headerBackgroundColor: { dark: string; light: string };
  headerContent?: string | ReactElement;
  showBackButton: boolean,
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerContent,
  noScroll,
  headerBackgroundColor,
  showBackButton,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const navigation = useNavigation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView scrollEnabled={!noScroll} ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {typeof headerImage == 'string' ? <Image src={headerImage} style={styles.headerImage} /> : headerImage}
          {
            typeof headerContent == 'string' 
              ? (
                  <BlurView style={styles.headerContent}> 
                    <ThemedText> {headerContent}</ThemedText> 
                  </BlurView>
                ) : headerContent 
          }
          {
            navigation.canGoBack() && showBackButton && (
            <BlurView style={styles.goBackButton}>
              <Pressable onPress={() => navigation.canGoBack() && navigation.goBack()}>
                <Icon name="arrow-back-outline" type={'ionicon'} color={Colors[colorScheme].text} />
              </Pressable>
            </BlurView>
            )
          }
        </Animated.View>
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  headerImage: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  goBackButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 16,
    padding: 16,
  },
  headerContent: {

  }
});
