import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, View } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/authCtx";
import LiliLogo from '@/assets/images/lilisdeliveryLogo.jpeg';
import { Redirect, SplashScreen } from 'expo-router';
import LoadingIndicator from '@/components/LoadingIndicator';

SplashScreen.preventAutoHideAsync();

export default function SignInScreen() {
  const { signIn } = useContext(AuthContext);
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signInForm}>
        <Image source={LiliLogo} style={styles.logo} />
        <GoogleSigninButton 
          onPress={ () => signIn('google') }
          size={GoogleSigninButton.Size.Standard}
        />  
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A984D9',
  },
  phoneInput: {
    width: '80%',
    textAlign: 'center',
  },
  signInForm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 48,
    marginBottom: 48,
  }
});