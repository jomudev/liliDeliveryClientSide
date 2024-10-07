import React, { useContext } from "react";
import { Pressable, PressableProps, StyleSheet, useColorScheme, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Button, ListItem } from "@rneui/themed";
import { Colors } from "@/constants/Colors";
import { AddressesContext } from "@/contexts/addressesCtx";

export type TAddressCardProps =  PressableProps & {
  id: string,
  name: string,
  address: string,
  selected?: boolean,
  onPress?: () => void,  
  onDelete?: () => void,
  onEdit?: () => void,
}

export default function AddressCard({ 
  name, 
  address, 
  selected, 
  onDelete,
  onPress, 
  onEdit,
  ...otherProps 
}: TAddressCardProps) {
  const theme = useColorScheme() || 'light';

  function handleOnPress() {
    if (onPress) onPress();
  };

  function handleDelete() {
    if (onDelete) onDelete();
  }

  function handleEdit() {
    if (onEdit) onEdit();
  }

  return (
    <ListItem.Swipeable
      containerStyle={[
        styles.container, 
        { 
          backgroundColor: selected ? '#DFDFDF' : Colors[theme].background 
        }
      ]}
      rightContent={
        <Button 
          icon={{ name: 'trash', type: 'ionicon' }}
          onPress={handleDelete}
          buttonStyle={{
            backgroundColor: Colors[theme].danger,
            height: '100%' 
          }}
        />
        }
      leftContent={
        <Button 
          icon={{ name: 'pencil', type: 'ionicon' }}
          onPress={handleEdit}
          buttonStyle={{
            backgroundColor: Colors[theme].warning,
            height: '100%' 
          }}
        />
        }
      >
      <Pressable {...otherProps} onPress={handleOnPress}>
        <ThemedText type="subtitle">
          { name }
        </ThemedText>
        <ThemedText ellipsizeMode="tail" numberOfLines={1}>
          { address }
        </ThemedText>
      </Pressable>
    </ListItem.Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    padding: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
  }
});