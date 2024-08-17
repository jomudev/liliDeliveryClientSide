import { Image, StyleSheet, Platform, TextInput } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxViewHeader from '@/components/ParallaxViewHeader';
import { useEffect, useState } from 'react';
import { randomDishImageURL } from '@/util/randomDishImage';
import RestaurantCard from '@/components/RestaurantCard';

const restaurantsData = [
  {
    "name": "Pizza Express",
    "description": "Authentic Italian pizza baked in a wood-fired oven.",
    "deliveryPrice": 50,
    "averageDeliveryTime": 30
  },
  {
    "name": "Sushi Zen",
    "description": "Delicious fresh sushi rolls and premium sashimi.",
    "deliveryPrice": 70,
    "averageDeliveryTime": 40
  },
  {
    "name": "Tacos Locos",
    "description": "Street tacos with an explosion of Mexican flavors.",
    "deliveryPrice": 30,
    "averageDeliveryTime": 25
  },
  {
    "name": "Burger Mania",
    "description": "Juicy gourmet burgers with fresh ingredients.",
    "deliveryPrice": 60,
    "averageDeliveryTime": 35
  },
  {
    "name": "La Pasta Mía",
    "description": "Handmade pasta with homemade sauces that will transport you to Italy.",
    "deliveryPrice": 50,
    "averageDeliveryTime": 45
  }
];

export default function HomeScreen() {
  const [headerImage, setHeaderImage] = useState('');
  useEffect(() => {
    randomDishImageURL().then((imageURL) => {
      setHeaderImage(imageURL);
    })
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFE37E', dark: '#FF7D70' }}
      headerImage={
        <Image 
          src={headerImage} 
          style={styles.headerImage}
          />
      }
      headerContent={ 
        <ParallaxViewHeader 
          title={'Your wish is my command'} 
          subtitle={'Find your favorites'}
          lightColor='white'
          darkColor='white'> 
        </ParallaxViewHeader>
      }
      >
      {
        restaurantsData.map((restaurant) => 
          <RestaurantCard key={Math.random().toString()} {...restaurant} />
        )
      }
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
