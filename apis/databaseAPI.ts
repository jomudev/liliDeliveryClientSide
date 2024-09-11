import { TUserData } from "./firebase";
import { Platform } from "react-native";
import feedback from "@/util/feedback";

let domain;
domain = Platform.OS == 'android' ? "http://10.0.2.2:3000" : "http://127.0.0.1:3000";

//domain = "https://delivery-test-backend.vercel.app";

const apiURL = domain;

let route : string;
let apiResponse: Object;
export async function apiFetch(pathName: string, options?: RequestInit) {
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
        'Content-Type': 'application/json',
      },
    })).json();
    console.info(`response for ${route}: \n${JSON.stringify(apiResponse, null, 2)}`);
    return apiResponse;
  } catch (err) {
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
        feedback(`😨Error trying to create the user: ${err}`)
        return null;
      }
    },  
    async getBusiness() {
      try {
        return await apiFetch('/api/business');
      } catch (err) {
        feedback(`😨 Connection error, check your internet connection`);
        return [];
      }
    },

    async getBusinessInfo(businessId: number) {
      try {
        return await apiFetch(`/api/business/${businessId}`);
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

    async getBusinessProducts(businessId: string) {
      try {
        return await apiFetch(`/api/products/${businessId}`);
      } catch(e) {
        feedback(`Check your network signal...`, e);
        return [];
      }
    }
  }
}