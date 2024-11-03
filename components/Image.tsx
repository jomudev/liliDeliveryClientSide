import isValidURL from "@/util/isValidURL";
import { Image as RNImage, ImageProps } from "react-native";
import DEFAULT_SOURCE from "@/assets/images/noImage.jpg";
import React from "react";

export const Image = ({ source, src, ...props }: ImageProps) => {
  const validSource = isValidURL(src || '') 
    ? { uri: src } 
    : source  
      ? source 
      : DEFAULT_SOURCE;
  
  return <RNImage {...props} source={validSource} defaultSource={DEFAULT_SOURCE} />;
};
