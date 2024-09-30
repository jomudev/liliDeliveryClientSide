import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Button, Icon, ListItem } from "@rneui/themed";
import toCurrency from "@/util/toCurrency";
import { Image } from "./Image";
import { ThemedView } from "./ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";

export type OrderProductProps = {
  name: string,
  price: number,
  quantity: number,
  imageURL: string,
  onChangeQuantity?: (quantity: number) => void,
  onHandleDelete?: () => void,
};

let newQuantity;

export default function OrderProduct({ 
  name, 
  price, 
  quantity: initialQuantity, 
  imageURL, 
  onChangeQuantity = () => {},
  onHandleDelete = () => {},
 }: OrderProductProps) {
  const theme = useColorScheme() ?? 'light';
  const [quantity, setQuantity] = useState(initialQuantity);
  
  const editQuantity = (newQuantity: number) => {
    if (newQuantity < 10 && newQuantity > 0) {
      setQuantity(newQuantity);
      onChangeQuantity(newQuantity);
    }
  }

  const addQuantity = () => {
    if (quantity < 10) {
      newQuantity = quantity + 1
      setQuantity(newQuantity);
      onChangeQuantity(newQuantity)
    }
  };

  const removeQuantity = () => {
    if (quantity > 1 ) {
      newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChangeQuantity(newQuantity)
    }
  };

  return (
    <ListItem.Swipeable
      rightContent={() => (
        <Button
          onPress={() => onHandleDelete && onHandleDelete()}
          icon={{ name: 'delete', color: 'white'}}
          buttonStyle={styles.deleteButton}
        />
      )}
      style={styles.container}
      containerStyle={{
        backgroundColor: Colors[theme].background,
      }}
      >
      <ListItem.Content style={{ flexDirection: 'row', alignItems: 'center'}}>
        <View style={{ minHeight: 100, flex: 0.33, alignItems: 'center' }}>
          <Image src={imageURL} style={{ height: 100, width: 100, borderRadius: 24 }} />
        </View>
        <View style={{ flex: 0.66 }}>
          <ListItem.Title style={{ color: Colors[theme].tint }}>{ name }</ListItem.Title>
          <ListItem.Subtitle style={{ color: Colors[theme].tint }}>{ toCurrency(price) }</ListItem.Subtitle>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Pressable style={styles.quantityButton} onPress={() => removeQuantity()}>
              <Icon name="remove-circle-outline" type='ionicon' color={Colors[theme].icon} />
            </Pressable>
            <TextInput 
              pointerEvents='none'
              style={{width: 24, textAlign: 'center', color: Colors[theme].tint}} 
              defaultValue={quantity.toString()} 
              value={quantity.toString()} 
              onChangeText={(value) => editQuantity(parseInt(value))} 
              />
            <Pressable style={styles.quantityButton}>
              <Icon name="add-circle-outline" onPress={() => addQuantity()} type='ionicon' color={Colors[theme].icon} />
            </Pressable>
          </View>
        </View>
      </ListItem.Content>
    </ListItem.Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  quantityButton: {
    padding: 8
  },
  deleteButton: { 
    minHeight: '100%', 
    width: 100, 
    alignSelf: 'flex-end', 
    backgroundColor: '#FF4F3E',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24 
  },
});