import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { TUserData } from '@/apis/firebase';
import { Alert } from 'react-native';

const AuthContext = createContext<{
  signIn: (user: TUserData) => void;
  signOut: () => void;
  session?: TUserData | null;
  isLoading: boolean;
}>({
  signIn: (user: TUserData) => {},
  signOut: () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: (userData: TUserData) => {
          // Perform sign-in logic here
          if (!userData && userData.uid) {
            Alert.alert('Invalid Information', 'Invalida user information, you must sign in with valid credential to use this app.');
          };
          setSession(userData);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
