import { TUserData } from "./firebase";
import { Platform } from "react-native";
import feedback from "@/util/feedback";
import { TProduct } from "@/hooks/useCatalog";
import { TBusiness } from "@/contexts/businessCtx";

let domain = "https://delivery-test-backend.vercel.app";

if (process.env.NODE_ENV == 'development') {
  domain = Platform.OS == 'android' ? "http://10.0.2.2:3000" : "http://127.0.0.1:3000";
}

const apiURL = domain;

let route : string;
let apiResponse: any;
export async function apiFetch<T>(pathName: string, options?: RequestInit): Promise<T | null> {
  if (pathName[0] !== "/") {
    pathName = "/" + pathName;
  }
  route = apiURL + pathName;
  console.info(`making request to ${route}`);
  try {
    apiResponse = await (await fetch(route, {
      method: 'GET',
      ...options,
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
      },
    })).json();
    if (Object.hasOwn(apiResponse, 'errorMessage')) {
      throw new Error(apiResponse.errorMessage, { cause: apiResponse.errorMessage });
    }
    console.info(`response for ${route}: \n${JSON.stringify(apiResponse, null, 2)}`);
    return apiResponse || null;
  } catch (err) {
    console.error(`response for ${route}: \n${err}`);
    throw err;
  }
};

export default function () {
  return {
    async createUser (user: TUserData) {
      try {
        return await apiFetch("/api/createUser", {
          method: 'POST',
          body: JSON.stringify({
            uid: user?.uid,
            phone: user?.phoneNumber,
          }),
        });
      } catch (err) {
        //feedback(`😨 Error trying to create the user: ${err}`)
        return null;
      }
    },  
    async getBusiness(): Promise<TBusiness[] | null> {
      try {
        return (await apiFetch<TBusiness>('/api/business')) || [];
      } catch (err) {
        feedback(`😨 Connection error, check your internet connection`);
        return [];
      }
    },

    async getBusinessInfo(businessId: number): Promise<TBusiness | null> {
      try {
        return await apiFetch<TBusiness>(`/api/business/${businessId}`);
      } catch (err) {
        feedback(`😨 Connection error, check your internet connection`);
        return null;
      }
    },

    async getBusinessCategories(businessId: string) {
      try {
        return await apiFetch(`/api/categories/${businessId}`);
      } catch (err) {
        feedback(`😨Error trying to get database category info: ${err}`);
        return [];
      }
    },

    async getCategoryProducts(categoryId: string, businessId: string) {
      try {
        return await apiFetch(`/api/products/${categoryId}`, {
          method: 'POST',
          body: JSON.stringify({ businessId }),
        });
      } catch (err) {
        feedback(`😨Error trying to get database category products: ${err}`);
        return [];
      }
    },

    async getBusinessProducts(businessId: string): Promise<TProduct[]> {
      try {
        const apiResponseProducts = await apiFetch<TProduct[]>(`/api/products/${businessId}`);
        return apiResponseProducts;
      } catch(e) {
        feedback(`Check your network signal...`, e);
        return [];
      }
    },

    async savePendingOrder(order: TOrder) {
      try {
        const apiResponse = await apiFetch('orders/createOrder');
        if (Object.hasOwn(apiResponse, 'errorMessage')) {
          throw new Error('an error has ocurred' + piResponse.errorMessage);
        }
      } catch (err) {
        console.log('api error', err);        
      }
    }
  }
}