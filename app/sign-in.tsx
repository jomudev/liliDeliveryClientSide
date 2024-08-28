import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Pressable } from 'react-native';
import { Input } from "@rneui/base";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useSession } from "@/contexts/authCtx";
import React, { useState } from "react";

export default function SignIn() {
  const { signIn } = useSession();
  const [ phoneNumber, setPhoneNumber ] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.signInForm}>
        <ThemedText type="subtitle">Sign in with your phone number</ThemedText>
        <Input 
          keyboardType="phone-pad" 
          placeholder={'1234-56789'} 
          style={styles.phoneInput} 
          onChange={(text) => setPhoneNumber(text)}
          />
        <Pressable onPress={() => signIn('phone', phoneNumber)}>
          <ThemedText> Sign In with phone number</ThemedText>
        </Pressable>
        <GoogleSigninButton onPress={() => signIn('google')} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  phoneInput: {
    width: '80%',
    textAlign: 'center',
  },
  signInForm: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});