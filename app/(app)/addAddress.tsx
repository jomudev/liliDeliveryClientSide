import { Container } from "@/components/Container";
import { Input } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ScrollView} from "react-native";
import * as Location from 'expo-location'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import feedback from "@/util/feedback";
import LoadingIndicator from "@/components/LoadingIndicator";
import useAddressForm from "@/hooks/useAddressForm";
import { ThemedText } from "@/components/ThemedText";
import { StyledLinkStyles } from "@/components/StyledLink";
import addressAPI, { emptyGeocodeResult, GeocodeResult, TAddressComponent } from "@/apis/addressAPI";
import { useNavigation } from "expo-router";
import { AddressesContext } from "@/contexts/addressesCtx";
import React from "react";

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

function getAddressComponents(address: GeocodeResult) {
  const findAddressComponent = (value: string) => address.addressComponents.find((addressComponent) => addressComponent.types.includes(value))?.long_name;

  let street = findAddressComponent('route') || '';
  let streetNumber = findAddressComponent('street_number') || '';
  let neighborhood = findAddressComponent('neighborhood') || '';
  let city = findAddressComponent('locality') || '';
  let apt = findAddressComponent('establishment') || '';
  let zipCode = findAddressComponent('postal_code') || '';
  let state = findAddressComponent('administrative_area_level_1') || '';
  return {
    street,
    streetNumber,
    neighborhood,
    city,
    apt,
    zipCode,
    state,
  }
}

export const emptyRegion: Region = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function addAddressScreen () {
  const { location, loadingLocation } = useLocation();
  const [region, setRegion] = useState<Region>(emptyRegion);
  const {
    addressAlias,
    streetAddress,
    setAddressAlias, 
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
  const { addAddress } = useContext(AddressesContext);
  const navigation = useNavigation();
  const [userNote, setUserNote] = useState<string>('');

  async function handleSetAddress({latitude, longitude}: { latitude: number, longitude: number }) {
    const approximatedAddresses: GeocodeResult[] = await addressAPI().coordsToAddress({
      lat: latitude,
      lng: longitude,
    });
    let addressWithMaxComponentsIndex = 0;
    approximatedAddresses.forEach((address: GeocodeResult, index: number) => {
      if (index == addressWithMaxComponentsIndex) return;
      if (address.addressComponents.length > approximatedAddresses[addressWithMaxComponentsIndex].addressComponents.length) {
        addressWithMaxComponentsIndex = index;
      }
    });
    let addressWithMostComponents = approximatedAddresses[addressWithMaxComponentsIndex];
    const address = addressWithMostComponents || emptyGeocodeResult;
    const { street, streetNumber, neighborhood, city, apt, zipCode, state } = getAddressComponents(address);
    
    setAddress({
      addressAlias,
      streetAddress: streetNumber.trim() + (Boolean(street) ? ',' : '') + street.trim() + (Boolean(neighborhood) ? ',' :  '') + neighborhood.trim(),
      apt: apt,
      city: city,
      zipCode: zipCode,
      countryState: state,
    });
  }

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
        handleSetAddress({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
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
      <ScrollView>
        <MapView 
          style={styles.map}
          initialRegion={region}
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
          onTouchEnd={() => handleSetAddress({
            latitude: region.latitude,
            longitude: region.longitude,
          })}
          >
            <Marker
              coordinate={{
                longitude: region.longitude,
                latitude: region.latitude,
              }}
              />
          </MapView>
        <Input placeholder="Alias" value={addressAlias} onChangeText={setAddressAlias} />
        <Input textContentType="streetAddressLine1" placeholder="Street Address" value={streetAddress} onChangeText={setStreetAddress} />
        <Input textContentType="streetAddressLine2" placeholder="Apt, Suit, or unit" value={apt} onChangeText={setApt} />
        <Input textContentType="addressCity" placeholder="City" value={city} onChangeText={setCity} />
        <View style={styles.horizontalGroup} >
          <Input textContentType="addressState" placeholder="State" style={styles.groupInput} value={countryState} onChangeText={setCountryState} />
          <Input placeholder="Zip Code" style={styles.groupInput} value={zipCode} onChangeText={setZipCode} />
        </View>
        <Input placeholder="User Note" value={userNote} onChangeText={setUserNote} />
          <Pressable 
            style={StyledLinkStyles} 
            onPress={() => {
              addAddress({
                name: addressAlias,
                address: streetAddress.trim() + ' ' + apt.trim() + ' ' + zipCode.trim() + city.trim() + ' ' + countryState.trim() + ' ', 
                userNote: userNote,
                longitude: region.longitude,
                latitude: region.latitude,
              });
              navigation.goBack();
            }} >
            <ThemedText>
              Save this address
            </ThemedText>
          </Pressable>
      </ScrollView>
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