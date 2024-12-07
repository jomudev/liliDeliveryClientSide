import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, View, useColorScheme, Button, Pressable } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/contexts/authCtx";
import LiliLogo from '@/assets/images/lilisdeliveryLogo.jpeg';
import { Redirect, router, SplashScreen, Stack } from 'expo-router';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Input } from '@rneui/themed';
import { ThemedText } from '@/components/ThemedText';
import StyledButton from '@/components/StyledButton';
import StyledLink from '@/components/StyledLink';
import passwordValidator from 'password-validator';
import feedback from '@/util/feedback';
import { getAuth } from '@react-native-firebase/auth';

SplashScreen.preventAutoHideAsync();

export default function SignInScreen() {
  const { user, isLoading, signIn } = useContext(AuthContext);
  const theme = useColorScheme() ?? "light";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');
  const emailIsVerified = useRef(false);
  const passwordIsVerified = useRef(false);
  const passwordDoNotMatch = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    SplashScreen.hideAsync();
  }, [isLoading]);

  useEffect(() => {
    (async () => {
      const isEmailValid = await handleVerifyEmail();
      const isPasswordValid = await handleVerifyPassword();
      emailIsVerified.current = isEmailValid;
      passwordIsVerified.current = isPasswordValid;
    })();
  }, [email, password, repeatPassword]);

  const handleVerifyEmail = useCallback(async () => {
    return true;
  }, [email])

  const handleVerifyPassword = useCallback(async () => {
    if (password !== repeatPassword) {
      passwordDoNotMatch.current = true;
      return false
    };
    return true;
  }, [password, repeatPassword]);

  const handleCreateAccount = useCallback(async () => {
    if (!emailIsVerified.current || !passwordIsVerified.current) {
      return false;
    };
    getAuth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.updateProfile({
        displayName: name
      });
      return user.getIdToken();
    })
    .then((idToken) => {
      return feedback(idToken);
    })
    .catch((error) => {
      console.log(error);
      feedback('Error Creating Account Try Again');
    });
  }, [email, password, name]);

  if (isLoading) return <LoadingIndicator loadingText={'Logging in ...'} /> 

  if (user) return <Redirect href={'/(tabs)'}  />
 
  return (
    <>
      <Stack.Screen options={{ title: 'Sign In' }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.signInForm}>
          <Image source={LiliLogo} style={styles.logo} />
          <ThemedText type='title' darkColor='black' lightColor='white'>Create Your Account</ThemedText> 
            <Input
              placeholder='John Doe' 
              style={styles.input}
              placeholderTextColor={theme === "light" ? '#fff' : '#444'} 
              onChangeText={(text) => setName(text)} 
              />
            <Input 
              placeholder='johndoe@email.com' 
              autoCapitalize='none'
              style={styles.input}
              placeholderTextColor={theme === "light" ? '#fff' : '#444'} 
              onChangeText={(text) => setEmail(text)} 
              />
              {
                !handleVerifyEmail() && <ThemedText type='defaultSemiBold' darkColor='green' lightColor='green'>
                  Enter a Valid Email
                </ThemedText>
              }
            <Input 
              placeholder='@!#$%@134' 
              style={styles.input}
              onChangeText={text => setPassword(text)}
              placeholderTextColor={theme === "light" ? '#fff' : '#444'} 
              secureTextEntry={true}
              />
            <Input 
              placeholder='Repeat Password' 
              style={styles.input}
              onChangeText={text => setRepeatPassword(text)}
              placeholderTextColor={theme === "light" ? '#fff' : '#444'} 
              secureTextEntry={true}
              />
            <ThemedText type='defaultSemiBold' darkColor='red' lightColor='red'>
              {
                !handleVerifyPassword() && 'Passwords do not match'
              }
              </ThemedText>
          <StyledButton style={styles.button} onPress={handleCreateAccount}>
            <ThemedText darkColor='black' lightColor='white'>Create Account</ThemedText>
          </StyledButton>
          <StyledLink 
            href="/sign-in" 
            style={{
              ...styles.button, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: '100%'
              }} 
            onPress={() => {}}>
            <ThemedText darkColor='black' lightColor='white'>I Have An Account</ThemedText>
          </StyledLink>
          <GoogleSigninButton 
            onPress={ () => {
              signIn('google');
              if (router.canGoBack()) {
                router.back();
              }
            }}
            size={GoogleSigninButton.Size.Standard}
          />  
        </View>
      </SafeAreaView>
    </>
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
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 8,
    padding: 16,
    color: 'white',
  },
  button: {
    backgroundColor: 'black',
    padding: 16,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInForm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    alignSelf: 'center',
    gap: 32,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 48,
    marginBottom: 48,
  }
});