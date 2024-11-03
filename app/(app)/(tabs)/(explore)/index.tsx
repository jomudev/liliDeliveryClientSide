import { StyleSheet } from 'react-native';
import { Image } from '@/components/Image';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ParallaxViewHeader from '@/components/ParallaxViewHeader';
import { useCallback, useContext, useEffect, useState } from 'react';
import { randomDishImageURL } from '@/util/randomDishImage';
import { AuthContext } from '@/contexts/authCtx';
import { Avatar } from '@rneui/themed';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import Branches from '@/components/Branches';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  const [headerImage, setHeaderImage] = useState('');
  const { user, signOut } = useContext(AuthContext);

  const getRandomDish = useCallback(() => {
    randomDishImageURL().then((imageURL) => {
      setHeaderImage(imageURL);
    })
  }, []);

  useEffect(() => {
    getRandomDish();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ParallaxScrollView 
        headerBackgroundColor={{ light: '#FFE37E', dark: '#FF7D70' }}
        headerImage={<Image
          src={headerImage}
          style={styles.headerImage} />}
        headerContent={<ParallaxViewHeader
          title={"🍔 Cravings? Consider them solved! 😋"}
          subtitle={"🔍 Discover Your Faves! 💖"}
          lightColor='white'
          darkColor='white'>
          <Avatar size={32} onPress={() => signOut()} source={{ uri: user?.photoURL }} rounded containerStyle={styles.avatar} />
        </ParallaxViewHeader>} showBackButton={false}>
        <ThemedView style={styles.container}>
          <Branches />
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  headerImage: {
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
  },
  headerSearchBox: {
    backgroundColor: 'transparent',
  },
});
