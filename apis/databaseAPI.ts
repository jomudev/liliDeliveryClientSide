import { TUserData } from "./firebase";
import { Platform } from "react-native";
import { TProduct } from "@/hooks/useCatalog";
import { TBusiness } from "@/contexts/businessCtx";
import { TOrder, TOrderProduct } from "@/hooks/useOrders";
import { TAddress } from "@/hooks/useAddresses";
import { TGroupedComplements } from "@/app/(app)/addComplement";
import feedback from "@/util/feedback";

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
    async getProduct(productId: string): Promise<TProduct | null> {
      try {
        return await apiFetch(`/products/${productId}`);
      } catch (err) {
        console.error(`😨 Error trying to get product info`, err);
        return null;
      }
    },
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
    async getBusiness(): Promise<TBusiness[]> {
      try {
        return (await apiFetch<TBusiness>('/api/business')) || [];
      } catch (err) {
        console.error(`😨 Connection error, check your internet connection`, err);
        return [];
      }
    },

    async getBusinessInfo(businessId: number): Promise<TBusiness | null> {
      try {
        return await apiFetch<TBusiness>(`/api/business/${businessId}`);
      } catch (err) {
        console.error(`😨 Connection error, check your internet connection`, err);
        return null;
      }
    },

    async getBusinessCategories(businessId: string) {
      try {
        return await apiFetch(`/api/categories/${businessId}`);
      } catch (err) {
        console.error(`😨Error trying to get database category info`, err);
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
        console.error(`😨Error trying to get database category products`, err);
        return [];
      }
    },

    async getBusinessProducts(businessId: string): Promise<TProduct[]> {
      try {
        const apiResponseProducts = await apiFetch<TProduct[]>(`/api/products/${businessId}`);
        return apiResponseProducts;
      } catch(err) {
        console.error(`Check your network signal...`, err);
        return [];
      }
    },

    async savePendingOrder(order: TOrder) {
      try {
        const apiResponse = await apiFetch('orders/createOrder');
        if (Object.hasOwn(apiResponse, 'errorMessage')) {
          throw new Error('an error has ocurred' + apiResponse.errorMessage);
        }
      } catch (err) {
        console.log('api error', err);        
      }
    },

    async createOrder(orderData: {
      paymentIntent: string,
      order: TOrderProduct[],
      orderTotal: number,
      shippingAddress: TAddress | null,
      shippingComment: string,
      shippingContact: string,
      userId: string,
      branchId: string | null, 
    }) {
      if (!orderData.orderTotal) throw new Error('order total is required');
      if (!orderData.order) throw new Error('order is required');
      if (!orderData.userId) throw new Error('user id is required');
      if (!orderData.branchId) throw new Error('branch id is required');
      if (!orderData.paymentIntent) throw new Error('payment intent is required');
      try {
        const apiResponse = await apiFetch('orders/createOrder', {
          method: 'POST',
          body: JSON.stringify(orderData),
        });
        if (Object.hasOwn(apiResponse, 'errorMessage')) {
          throw new Error('an error has ocurred' + apiResponse.errorMessage);
        }
      } catch (err) {
        console.log('api error', err);
        throw err;
      }
    },

    getPendingOrders: async (userId: string) => {
        try {
          const apiResponse: any = (await apiFetch(`/orders/${userId}/pending`));
          if (Object.hasOwn(apiResponse, 'errorMessage')) {
            throw new Error('an error has ocurred' + apiResponse.errorMessage);
          }
          return apiResponse;
        } catch (err) {
          console.log('api error', err);
          throw err;
        }
    },
    
    async getProductComplements(productId: string): Promise<TGroupedComplements[]> {
      try {
        if (!productId) {
          throw new Error('productId is required');
        }
        return await apiFetch(`/products/${productId}/complements`);
      } catch (err) {
        console.error(`😨Error trying to get database complements products`, err);
        return [];
      }
    }
  }
}