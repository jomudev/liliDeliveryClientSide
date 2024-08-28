import { Platform } from "react-native";
import { TUserData } from "./firebase";
import { User } from "@react-native-google-signin/google-signin";

let domain = Platform.OS == 'android' ? "192.168.67.246" : "localhost";
if (process.env.NODE_ENV !== 'production') {
  domain = "";
}

const apiURL = `http://${domain}:3000`;

let route : string;
let apiResponse: Object;
export async function apiFetch (pathName: string, options?: RequestInit) {
  console.info(`making request to ${apiURL}`);
  if (pathName[0] !== "/") {
    pathName = "/" + pathName;
  }
  route = apiURL + pathName;
  try {
    apiResponse = await (await fetch(route, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })).json();
  } catch (err) {
    console.error(err);
  }
};

export default function () {
  return {
    createUser : async function (user: TUserData) {
      return await apiFetch("/api/createUser", {
        method: 'POST',
        body: JSON.stringify({
          uid: user?.uid,
          phone: user?.phoneNumber,
        }),
      });
    },  
    getBusiness: async function () {
      return await apiFetch('/api/business');
    },
  }
}