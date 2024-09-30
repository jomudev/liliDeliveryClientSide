import { apiFetch } from '@/apis/databaseAPI';

export type TAddressComponent = {
  long_name: string,
  short_name: string;
  types: string;
}

export type LatLngLiteral = {
  lat: number,
  lng: number,
};

export type LatLngBounds = { 
  northeast: LatLngLiteral, 
  southwest: LatLngLiteral,
};

export type AddressGeometry = { 
  bounds?: LatLngBounds,
  location: LatLngLiteral,
  location_type?: string,
  viewport: LatLngLiteral,
};

export type GeocodeResult = {
  addressComponents: TAddressComponent[];
  formattedAddress: string;
  geometry: AddressGeometry;
  partialMatch: boolean;
  placeId: string;
  postCodes: string[];
};

export default function addressAPI () {
  return {

    async validateAddress (address) {
      const validation = apiFetch('addressValidator', {
        method: 'POST',
        body: JSON.stringify(address),
      });
      if (!validation) return null;

      return validation;
    },
    async coordsToAddress ({ lat, lng }: LatLngLiteral): Promise<GeocodeResult[]> {
      try {
        const addresses: GeocodeResult[] = (await apiFetch('addressValidator/coordsToAddress', {
          method: 'POST',
          body: JSON.stringify({ latitude: lat, longitude: lng })
        })) || [];
        return addresses;
      } catch (err) {
        console.error('Error trying to get the address from location');
        return []
      }
    }
  }
}