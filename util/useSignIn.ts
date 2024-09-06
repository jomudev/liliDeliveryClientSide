import { useEffect, useState } from 'react';
import { TUserData } from '@/apis/firebase';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import databaseAPI from '@/apis/databaseAPI';
import { Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import clientIdGetter from './clientIdManager';
import feedback from './feedback';
const clientsId = clientIdGetter();

export type TErrorMessage = {
  title: string,
  message: string,
}

let googleCredential;

export default function useSignIn () {
  const [user, setUser] = useState<TUserData | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: clientsId.clientId,
    });
    setIsGoogleConfigured(true);
    console.log("waiting for auth state change...");
    const unsubscribe = auth().onAuthStateChanged((authUser: TUserData | null) => {
      setUser(authUser);
      console.info(`auth state change: setting cloud user in ${Platform.OS}: ${JSON.stringify(authUser?.email, null, 2)}`);
      if (isLoading) setIsLoading(false);
      if (authUser) databaseAPI().createUser(authUser);
    })
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!isGoogleConfigured) {
      feedback("Google Sign-in is not configured yet, contact the app Owner");
      return;
    }
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const authUser = await auth().signInWithCredential(googleCredential);
      setUser(authUser.user);
      setIsLoading(false);
    } catch (err: any) {
      if (err.code == -5) return;
      feedback(`🤔 Something weird is happening here, please contact for support...`);
      console.error(`Google Sign-in ${err}`);
    }
  }

  const signInWithApple = async () => {
    feedback('sign-in with apple');
  }

  const logout = () => {
    try {
      auth().signOut();
      setUser(null);
    } catch (err: any) {
      console.error(`Error trying to signOut: ${err}`);
    }
  }

  return { user, isLoading, signInWithGoogle, signInWithApple, logout };
};  

/**
 * 
 * const [accessToken, setAccessToken] = useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({...clientsId});

const clientsId = clientIdGetter();

  useEffect(() => {
    if (Boolean(response) && response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userInfo = await response.json();
    setUser(userInfo);
  } 
 */