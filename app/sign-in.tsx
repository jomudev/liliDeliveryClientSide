import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, View, useColorScheme, Button, Pressable, ActivityIndicator } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/authCtx";
import LiliLogo from '@/assets/images/lilisdeliveryLogo.jpeg';
import { Link, Redirect, router, SplashScreen, Stack } from 'expo-router';
import { Input } from '@rneui/themed';
import { ThemedText } from '@/components/ThemedText';
import StyledButton from '@/components/StyledButton';
import StyledLink from '@/components/StyledLink';

SplashScreen.preventAutoHideAsync();

export default function SignInScreen() {
  const { user, isLoading, signIn, signInWithEmailAndPassword } = useContext(AuthContext);
  const theme = useColorScheme() ?? "light";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = useCallback(async () => {
    signInWithEmailAndPassword(email, password);
  }, [email, password]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (user) return <Redirect href='/(app)/(tabs)' />
 
  return (
    <>
      <Stack.Screen options={{ title: 'Sign In' }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.signInForm}>
          <Image source={LiliLogo} style={styles.logo} />
          <ThemedText darkColor='black' lightColor='white' type='title'>Sign In To Continue</ThemedText>
          {
            isLoading ? <ActivityIndicator size='large' color='black' /> : (
              <>
                <Input 
                  placeholder='johndoe@email.com' 
                  autoCapitalize='none'
                  style={styles.input}
                  placeholderTextColor={theme === "light" ? '#fff' : '#444'} 
                  onChangeText={(text) => setEmail(text)} 
                  />
                <Input 
                  placeholder='@!#$%@134' 
                  style={styles.input}
                  onChangeText={text => setPassword(text)}
                  placeholderTextColor={theme === "light" ? '#fff' : '#444'} 
                  secureTextEntry={true}
                  />
              <StyledButton style={styles.button} onPress={handleSignin}>
                <ThemedText darkColor='black' lightColor='white'>Login</ThemedText>
              </StyledButton>
              <StyledLink 
                href="/createAccount" 
                style={{
                  ...styles.button, 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  width: '100%'
                }} 
                onPress={() => {}}>
                <ThemedText darkColor='black' lightColor='white'>Sign Up</ThemedText>
              </StyledLink>
              <Link href="/(tabs)">
                <ThemedText darkColor='black' lightColor='white'>Go to Explore</ThemedText>
              </Link>
              <GoogleSigninButton 
                onPress={ () => {
                  signIn('google');
                  if (router.canGoBack()) {
                    router.back();
                  }
                }}
                size={GoogleSigninButton.Size.Standard}
                />  
              </>
            )
          }
            
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