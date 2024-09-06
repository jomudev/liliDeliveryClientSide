import { Alert, Platform, ToastAndroid } from "react-native";

export default function feedback (message: string) {
  console.info(message);
  if (Platform.OS == "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
    return;
  }
  Alert.alert("Lili's Delivery", message);
}