import isValidURL from "@/util/isValidURL";
import { Image as RNImage, ImageProps } from "react-native";
import DEFAULT_SOURCE from '@/assets/images/noImage.jpg';

export const Image = (props: ImageProps) => {
  if (isValidURL(props.src || '')) return <RNImage {...props} defaultSource={DEFAULT_SOURCE}/>
  return <RNImage defaultSource={DEFAULT_SOURCE} source={DEFAULT_SOURCE} {...props} />
};