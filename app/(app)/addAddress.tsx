import { Container } from "@/components/Container";
import { Input } from "@rneui/themed";
import { ReducerAction, useEffect, useReducer, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import * as Location from 'expo-location'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import feedback from "@/util/feedback";
import LoadingIndicator from "@/components/LoadingIndicator";
import useAddressForm from "@/hooks/useAddressForm";
import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { StyledLinkStyles } from "@/components/StyledLink";
import addressAPI, { GeocodeResult, TAddressComponent } from "@/apis/addressAPI";
import useAddresses from "@/hooks/useAddresses";
import { useNavigation } from "expo-router";

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  useEffect(() => {
    (async function () {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        feedback('Location permission was denied.');
        return;
      }
      let givenLocation = await Location.getCurrentPositionAsync();
      if (!givenLocation) {
        feedback('Error trying to get Location');
        return;
      }
      setLocation(givenLocation);
      setLoadingLocation(false);
    })()
  }, []);

  return { location, setLocation, loadingLocation };
}

export default function addAddressScreen () {
  const { location, loadingLocation } = useLocation();
  const [region, setRegion] = useState<Region>();
  const { 
    address,
    fullAddress,
    streetAddress, 
    setStreetAddress, 
    apt, 
    setApt, 
    city, 
    setCity, 
    countryState, 
    setCountryState, 
    zipCode, 
    setZipCode,
    setAddress
  } = useAddressForm();
  const { addAddress } = useAddresses();
  const navigation = useNavigation();

  useEffect(() => {
    if (location) {
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: .01,
        longitudeDelta: .01,
      });
      (async function () {
        const approximatedAddresses: GeocodeResult[] = await addressAPI().coordsToAddress({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        approximatedAddresses.forEach((address: GeocodeResult, index) => {
          if (index == 0) {
            const findAddressComponent = (value) => address.addressComponents.find((addressComponent) => addressComponent.types.includes(value))?.long_name;

            let street = findAddressComponent('route');
            let streetNumber = findAddressComponent('street_number');
            let neighborhood = findAddressComponent('neighborhood');
            let city = findAddressComponent('locality');
            let apt = findAddressComponent('establishment');
            let zipCode = findAddressComponent('postal_code');
            let state = findAddressComponent('administrative_area_level_1');
            setAddress({
              streetAddress: `${streetNumber || ''}${street && ','} ${street || ''}${neighborhood && ','} ${neighborhood || ''}`,
              apt: apt || '',
              city: `${city || ''}`,
              zipCode: zipCode || '',
              countryState: state || '',
              fullAddress: address.formattedAddress,
            });
          }
        });
      })();
    }
  }, [location])

  if (loadingLocation) {
    return <LoadingIndicator />
  }

  if (!region) {
    return <LoadingIndicator />
  }

  return (
    <Container>
      <Input placeholder="Street Address" value={streetAddress} onChangeText={setStreetAddress} />
      <Input placeholder="Apt, Suit, or unit" value={apt} onChangeText={setApt} />
      <Input placeholder="City" value={city} onChangeText={setCity} />
      <View style={styles.horizontalGroup} >
        <Input placeholder="State" style={styles.groupInput} value={countryState} onChangeText={setCountryState} />
        <Input placeholder="Zip Code" style={styles.groupInput} value={zipCode} onChangeText={setZipCode} />
      </View>
      <MapView 
        style={styles.map}
        initialRegion={region}
        showsMyLocationButton
        provider={ PROVIDER_GOOGLE }
        onRegionChange={({ latitude, longitude }: Region) => setRegion((prevRegion: Region): Region => {
          if (latitude != prevRegion.latitude || longitude != prevRegion.longitude) {
            return ({
              ...prevRegion,
              latitude,
              longitude,
            })
          }
          return prevRegion;
        })}
        >
          <Marker
            coordinate={{
              longitude: region.longitude,
              latitude: region.latitude,
            }}
          />
        </MapView>
        <Pressable 
          style={StyledLinkStyles} 
          onPress={() => {
            addAddress({
              name: 'address',
              address: fullAddress,
              longitude: region.longitude,
              latitude: region.latitude,
            });
            navigation.goBack();
          }} >
          <ThemedText>
            Save this address
          </ThemedText>
        </Pressable>
    </Container>
  );
}


const styles = StyleSheet.create({
  horizontalGroup: {
  },
  groupInput: {
  },
  map: {
    width: '100%',
    height: 200,
  }
});