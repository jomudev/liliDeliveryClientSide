import { initializeApp } from 'firebase/app';
import { getAuth, User, UserMetadata, } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyARRYqaaGomXWAYJeRxW7Esx5YvWUMfKwg",
  authDomain: "lilideliverytesting.firebaseapp.com",
  projectId: "lilideliverytesting",
  storageBucket: "lilideliverytesting.appspot.com",
  messagingSenderId: "621584861964",
  appId: "1:621584861964:web:684b3c64a06933eb381729"
};

export const app = initializeApp(firebaseConfig);

export type TUserData = {
  uid: string;
  displayName: string,
  email: string,
  photoURL: string,
  phone: string,
};  
export const auth = getAuth(app);
export const messaging = getMessaging(app);
