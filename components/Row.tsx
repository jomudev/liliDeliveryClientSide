import React from "react";
import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

export default function Row ({ children, ...props }: PropsWithChildren & ViewProps) {
  return (
    <View style={[ props.style, { flexDirection: 'row'}]}>
      { children }
    </View>
  )
};