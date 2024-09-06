import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyARRYqaaGomXWAYJeRxW7Esx5YvWUMfKwg",
  authDomain: "lilideliverytesting.firebaseapp.com",
  projectId: "lilideliverytesting",
  storageBucket: "lilideliverytesting.appspot.com",
  messagingSenderId: "621584861964",
  appId: "1:621584861964:web:684b3c64a06933eb381729"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export type TUserData = FirebaseAuthTypes.User;
