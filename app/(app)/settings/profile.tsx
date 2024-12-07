import { TUserData } from "@/apis/firebase";
import { Container } from "@/components/Container";
import { getAuth, updateProfile } from "@react-native-firebase/auth";
import { AuthContext } from "@/contexts/authCtx";
import { Avatar, Input } from "@rneui/themed";
import { Stack } from "expo-router";
import React, { useCallback, useContext, useRef } from "react";
import { Button } from "react-native";
import feedback from "@/util/feedback";
import { ThemedText } from "@/components/ThemedText";
const currentUser = getAuth().currentUser;

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  const userProfilePhoto = user?.photoURL || '';
  const userUpdatedData = useRef<TUserData | null>(user); 

  const handleUpdateUserData = useCallback(async () => {
    if (!userUpdatedData) return;
    if (!userUpdatedData.current) return;
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, userUpdatedData.current);
      console.log(userUpdatedData.current);
      if (userUpdatedData.current.phoneNumber) {
        const snapshot = await getAuth().verifyPhoneNumber(userUpdatedData.current.phoneNumber)
        .on('state_changed', (verification) => {
          if (verification.state === 'verified') {
            console.log('Verification code for phone number', userUpdatedData?.current?.phoneNumber, 'has been successfully sent ');
          } else {
            console.log('Error verifying phone number', userUpdatedData?.current?.phoneNumber, 'for phone number with error', verification.error);
          }
        });
        console.log(snapshot);
      } 
      currentUser.updatePhoneNumber; 
      feedback('Profile updated');
    } catch (err: any) {
      console.error(`Error updating profile: ${err}`);
      feedback(`Error updating profile, contact support`);
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Profile', headerBackTitle: 'Back', headerBackButtonMenuEnabled: true }} /> 
      <Container style={{ alignItems: 'center'}} >
        <Avatar 
          source={{ uri: Boolean(userProfilePhoto) ? userProfilePhoto : undefined }}
          size={100}
          containerStyle={{ marginBottom: 20 }}
        />
        <Input 
          placeholder="Name" 
          defaultValue={user?.displayName || ''} 
          onChangeText={(text) => 
            userUpdatedData.current = { 
              ...userUpdatedData.current, 
              displayName: text }}     
          />
        <Input 
          placeholder="Email" 
          defaultValue={user?.email || ''} 
          onChangeText={(text) => 
            userUpdatedData.current = { 
              ...userUpdatedData.current, 
              email: text }}             
          />
        <ThemedText darkColor="gray" lightColor="gray" >Information update will be reflected in the next login</ThemedText>
        <Button title="Save" onPress={() => handleUpdateUserData()} />
      </Container>
    </>
  );
};