import * as WebBrowser  from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';
import clientIdGetter from './clientIdManager';
import { 
  GoogleAuthProvider, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber, 
  signInWithCredential 
} from 'firebase/auth';
import { auth, TUserData } from '@/apis/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import databaseAPI from '@/apis/databaseAPI';

const api = databaseAPI();

export type TErrorMessage = {
  title: string,
  message: string,
}

WebBrowser.maybeCompleteAuthSession();

const idClients = clientIdGetter();

export function useLocalUser() {
  const onGetLocalUser = async () => {  
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      return userJSON && JSON.parse(userJSON);
    } catch(e) {
      console.error(new Error("Error trying to access local user data"));
    }
  }

  const handleSaveLocalUser = async (user: TUserData) => {
    await AsyncStorage.setItem("@user", JSON.stringify(user));
  }

  return [onGetLocalUser, handleSaveLocalUser];
};

export default function useSignIn () {
  const [onGetLocalUser, handleSaveLocalUser] = useLocalUser();
  const [user, setUser] = useState<TUserData>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: idClients.iosClientId,
    androidClientId: idClients.androidClientId,
  });

  useEffect(() => {
    if ( response?.type == 'success' ) {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    onGetLocalUser().then(async (localUser) => {
      if (localUser) {
        //setUser(localUser);
        //await api.createUser(localUser);
      }
    }).catch((err) => {
      console.warn(err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (userInfo) => {
      setIsLoading(false);
      if (user) return;
      if (userInfo) {
        setUser(userInfo);
        handleSaveLocalUser(userInfo);
        await api.createUser(userInfo);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await promptAsync();
  }

  const signInWithApple = async () => {

  }

  const signInWithPhone = async (phoneNumber: string) => {
    console.info('signin with phone');
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
      'callback': async (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      },
      'expired-callback': async () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
        await signInWithPhone(phoneNumber);
      }
    });
  }

  return [ user, isLoading, signInWithGoogle, signInWithPhone, signInWithApple ];
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