import { createContext, type PropsWithChildren } from 'react';
import { TUserData } from '@/apis/firebase';
import useSignIn from '@/util/useSignIn';

export const AuthContext = createContext<{
  signIn: (method: string) => void;
  signOut: () => void;
  user?: TUserData | null;
  isLoading: Boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  user: null,
  isLoading: false,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const {
    user, 
    isLoading, 
    signInWithGoogle,  
    logout 
  } = useSignIn();
  
  const signInMethods: Record<string, () => Promise<void>> = {
    google: signInWithGoogle,
  };
  
  return (
    <AuthContext.Provider
      value={{
        signIn: (method: string, value?: string) => {
          // Perform sign-in logic here      
          signInMethods[method]();
        },
        signOut: () => {
          logout();
        },
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
