import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { TUserData } from '@/apis/firebase';
import useSignIn from '@/util/useSignIn';

export const AuthContext = createContext<{
  signIn: (method: string) => void;
  signOut: () => void;
  user?: TUserData | null;
  isLoading: boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  user: null,
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
  const [user, isLoading, signInWithGoogle, signInWithPhone, signInWithApple] = useSignIn();
  
  return (
    <AuthContext.Provider
      value={{
        signIn: (method: string, value: string) => {
          // Perform sign-in logic here
          if (method === 'google') 
            signInWithGoogle();
          if (method === 'phone') 
            signInWithPhone(value);
        },
        signOut: () => {
          setSession(null);
        },
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
