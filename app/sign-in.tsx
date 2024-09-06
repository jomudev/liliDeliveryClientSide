import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, Pressable } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { AuthContext } from "@/contexts/authCtx";
import React, { useContext } from "react";
import { Redirect } from "expo-router";

export default function SignIn() {
  const { user, signIn } = useContext(AuthContext);

  if (user) {
    return <Redirect href={'/(app)/(tabs)'} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.signInForm}>
        <Image source={require('@/assets/images/lilisdeliveryLogo.jpeg')} style={styles.logo} />
        <GoogleSigninButton 
          onPress={ () => signIn('google') }
          size={GoogleSigninButton.Size.Standard}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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