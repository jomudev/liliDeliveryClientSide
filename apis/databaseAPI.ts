import { TUserData } from "./firebase";
import { Platform } from "react-native";
import { TProduct } from "@/hooks/useCatalog";
import { TBusiness } from "@/contexts/businessCtx";
import { TOrder, TOrderProduct } from "@/hooks/useOrders";
import { TAddress } from "@/hooks/useAddresses";
import { TGroupedComplements } from "@/app/(app)/(tabs)/(WithAuthOnly)/addComplement";
import feedback from "@/util/feedback";
import { TOrderData } from "@/hooks/usePayment";

let alertShowed = false;

const apiURL = process.env.NODE_ENV === 'development' && Platform.OS === 'android' 
  ? "http://10.0.2.2:3000" 
  : process.env.NODE_ENV === 'development' 
  ? "http://127.0.0.1:3000" 
  : "https://delivery-test-backend.vercel.app";

export async function apiFetch<T>(pathName: string, options?: RequestInit): Promise<T | null> {
  const route = `${apiURL}/${pathName.startsWith('/') ? pathName.slice(1) : pathName}`;
  console.info(`Requesting: ${route}`);

  try {
    const response = await fetch(route, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
      },
      ...options,
    });

    const data = await response.json();

    if ('errorMessage' in data) {
      throw new Error(data.errorMessage);
    }

    console.info(`Response from ${route}: ${JSON.stringify(data, null, 2)}`);
    return data || null;

  } catch (error) {
    console.error(`Error in request to ${route}:`, error);
    if (!alertShowed) {
      alertShowed = true;
      feedback(`Error: Could not connect to the server. Please try again later.`, () => {
        alertShowed = false;
      });
    }
    return null;
  }
}

export default function useApi() {
  return {
    async getProduct(productId: string): Promise<TProduct | null> {
      return apiFetch<TProduct>(`/products/${productId}`);
    },

    async deleteUser(uid: string) {
      await apiFetch("/api/deleteUser", {
        method: 'POST',
        body: JSON.stringify({
          uid,
        }),
      });
    },

    async createUser(user: TUserData): Promise<void> {
      await apiFetch("/api/createUser", {
        method: 'POST',
        body: JSON.stringify({
          uid: user.uid,
          phone: user.phoneNumber,
        }),
      });
    },

    async getBusiness(): Promise<TBusiness[]> {
      return (await apiFetch<TBusiness[]>('/api/business')) || [];
    },

    async getBusinessInfo(businessId: number): Promise<TBusiness | null> {
      return apiFetch<TBusiness>(`/api/business/${businessId}`);
    },

    async getBusinessCategories(businessId: string): Promise<any[]> {
      return (await apiFetch<any[]>(`/api/categories/${businessId}`)) || [];
    },

    async getCategoryProducts(categoryId: string, businessId: string): Promise<TProduct[]> {
      return (await apiFetch<TProduct[]>(`/api/products/${categoryId}`, {
        method: 'POST',
        body: JSON.stringify({ businessId }),
      })) || [];
    },

    async getBusinessProducts(businessId: string): Promise<TProduct[]> {
      return (await apiFetch<TProduct[]>(`/api/products/${businessId}`, {
        method: 'POST',
        body: JSON.stringify({ 
          page: 1,
          length: 10,
         }),
      })) || [];
    },

    async savePendingOrder(order: TOrder): Promise<void> {
      const response = await apiFetch('/orders/createOrder', {
        method: 'POST',
        body: JSON.stringify(order),
      });

      if (response && 'errorMessage' in response) {
        console.error(`Save Order Error: ${response.errorMessage}`);
      }
    },

    async createOrder(orderData: TOrderPaymentData): Promise<void> {
      if (!orderData.orderTotal || !orderData.order || !orderData.userId || !orderData.branchId || !orderData.paymentIntent) {
        throw new Error('Missing required order data');
      }

      const response = await apiFetch('/orders/createOrder', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (response && 'errorMessage' in response) {
        throw new Error(`Order Creation Error: ${response.errorMessage}`);
      }
    },

    async getPendingOrders(userId: string): Promise<any[]> {
      const response = await apiFetch<any[]>(`/orders/${userId}/pending`);

      if (response && 'errorMessage' in response) {
        console.error(`Get Pending Orders Error: ${response.errorMessage}`);
        return [];
      }
      
      return response;
    },

    async getProductComplements(productId: string): Promise<TGroupedComplements[]> {
      if (!productId) {
        console.error('Error: Product ID is required');
        return [];
      }

      const response = await apiFetch<TGroupedComplements[]>(`/products/${productId}/complements`);
      return response || [];
    },
    async getOrderData(orderId: string): Promise<TOrderData> {
      return apiFetch<TOrderData>(`/orders/${orderId}`);
    },
  }
}

type TOrderPaymentData = TOrderData & {
  paymentIntent: string;
};
