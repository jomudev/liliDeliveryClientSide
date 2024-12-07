import { Alert, AlertButton } from "react-native";

export const promiseAlert = (title: string, message: string, options: PromptOptions) => {
  return new Promise((resolve) => {
    Alert.alert(
      title, 
      message, 
      options.map((option, index) => ({
      ...options[index],
      onPress: () => {
        option.onPress && option.onPress();
        resolve(option);
      }
    })));
  });
};

type Button = AlertButton

export type PromptOptions = Button[];