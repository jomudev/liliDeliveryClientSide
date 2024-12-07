import { useCallback, useEffect, useRef, useState } from 'react';
import { TUserData } from '@/apis/firebase';
import auth, { deleteUser, getAuth } from '@react-native-firebase/auth';
import databaseAPI from '@/apis/databaseAPI';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import clientIdGetter from './clientIdManager';
import feedback from './feedback';
import toJSON from './toJSON';
import { promiseAlert, PromptOptions } from './promiseAlert';
const clientsId = clientIdGetter();

export type TErrorMessage = {
  title: string,
  message: string,
}

export default function useSignIn () {
  const [user, setUser] = useState<TUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const configureSignIn = useCallback(() => {
    try {
      GoogleSignin.configure({
        webClientId: clientsId.clientId,
      });
    } catch (err) {
      feedback(`🤔 Something weird is happening here, please contact for support...`);
      console.error(`Google Sign-in ${err}`);
    }
  }, [clientsId]);

  const signInWithEmailAndPassword = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await getAuth().signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      if (err.code == 'auth/wrong-password') {
        feedback('Wrong Password');
        return;
      }
      if (err.code == 'auth/user-not-found') {
        feedback('User not found');
        return;
      }
      feedback(`🤔 Something weird is happening here, please contact for support...`);
      console.warn(`Google Sign-in ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    const options: PromptOptions = [
      {
        text: 'Delete Account Anyway',
        onPress: async () => {
          try {
            if (user) {
              await databaseAPI().deleteUser(auth().currentUser?.uid || '');
              await deleteUser(user);
              await auth().signOut();
            }
          } catch (err: any) {
            feedback('Error deleting account');
            console.error(`Error trying to delete account: ${err}`);
            return;
          }
        },
      },
      {
        text: 'Cancel, I\'ll do it later',
        onPress: () => {},
      },
    ];

    promiseAlert(
      'Delete Account', 
      'Are you sure you want to delete your account? if you accept you\'ll loose all your data.', 
      options
    );
  }, []);

  const handleAuthOnMount = useCallback(() => {
    configureSignIn();
    const unsubscribe = auth().onAuthStateChanged((authUser: TUserData | null) => {
      setUser(authUser);
      console.info(`Auth state change: setting cloud user in ${Platform.OS}: ${toJSON(authUser)}`);
      if (authUser) {
        databaseAPI().createUser(authUser);
      }
      setIsLoading(false);
    });
    return unsubscribe; // Ensuring the cleanup happens properly
  }, []);

  useEffect(() => {
    console.info('Waiting for auth state change...');
    const unsubscribe = handleAuthOnMount();
    return () => unsubscribe(); // Cleanup auth state listener on unmount
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const authUser = await auth().signInWithCredential(googleCredential);
      setUser(authUser.user);
    } catch (err: any) {
      if (err.code == -5) return;
      feedback(`🤔 Something weird is happening here, please contact for support...`);
      console.log(`Google Sign-in ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [])

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

  return { 
    user,
    deleteAccount, 
    isLoading, 
    signInWithGoogle, 
    signInWithApple, 
    signInWithEmailAndPassword,
    logout 
  };
};  
