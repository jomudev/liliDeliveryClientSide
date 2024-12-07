import { AuthContext } from "@/contexts/authCtx";
import { PropsWithChildren, useContext } from "react";
import { Redirect, SplashScreen, usePathname } from "expo-router";
import React from "react";
import { Alert } from "react-native";

SplashScreen.preventAutoHideAsync();

export default  function  AuthHandler({ children}: PropsWithChildren) {
  const { user, isLoading } = useContext(AuthContext);

  if ((!Boolean(user) && !isLoading) || !Boolean(user)) {
    return <Redirect href="/sign-in" />
  }
  return children;
}