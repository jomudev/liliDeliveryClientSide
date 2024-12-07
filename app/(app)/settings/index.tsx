import { Container } from "@/components/Container";
import { ThemedText } from "@/components/ThemedText";
import { AuthContext } from "@/contexts/authCtx";
import { router, Stack } from "expo-router";
import React, { useContext } from "react";
import { Button, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { deleteAccount } = useContext(AuthContext);
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Settings', headerBackTitle: 'Back' }}/>
        <Container>
          <Button title="Edit Profile" onPress={() => router.replace('/(app)/settings/profile')} />
          <Button title="Logout" onPress={() => signOut()} />
          <Button color={'red'} title="Delete Account" onPress={() => deleteAccount()} />
        </Container>
    </>
  );
};