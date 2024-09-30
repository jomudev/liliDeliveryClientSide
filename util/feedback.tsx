import { Alert, Platform, ToastAndroid } from "react-native";

export default function feedback (message: string) {
  if (Platform.OS == "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
    return;
  }
  Alert.alert("Lili's Delivery", message);
}