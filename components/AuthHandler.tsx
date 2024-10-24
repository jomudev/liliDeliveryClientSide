import { AuthContext } from "@/contexts/authCtx";
import { PropsWithChildren, useContext } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { Redirect, SplashScreen } from "expo-router";
import React from "react";

const waitingMessages  = ['Waiting for user data...', 'This may take a while...', 'Please wait...', 'This is taking a while...', 'We have troubles, Try again later...'];
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default  function  AuthHandler({ children}: PropsWithChildren) {
  const { user, isLoading } = useContext(AuthContext);
  
  if (!isLoading) {  
    SplashScreen.hideAsync();
  }
  
  if (isLoading) {
    return <LoadingIndicator loadingText={waitingMessages[0]} />;
  }

  if (!Boolean(user) && !isLoading) {
    return <Redirect href="/sign-in" />
  }

  return children;
}