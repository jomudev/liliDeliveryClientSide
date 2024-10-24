import React, { createContext, type PropsWithChildren } from 'react';
import { TUserData } from '@/apis/firebase';
import useSignIn from '@/util/useSignIn';

export const AuthContext = createContext<{
  signIn: (method: signInMethods) => void;
  signOut: () => void;
  user?: TUserData | null;
  isLoading: Boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  user: null,
  isLoading: false,
});

export type signInMethods = 'google' | 'apple';

export function SessionProvider({ children }: PropsWithChildren) {
  const {
    user, 
    isLoading, 
    signInWithGoogle,  
    logout 
  } = useSignIn();
  
  const signInMethods: Record<signInMethods, () => Promise<void>> = {
    google: signInWithGoogle,
    apple: () => new Promise(() => {}),
  };

  const signIn = (method: signInMethods) => signInMethods[method]();
  const signOut = () => logout();
  
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
