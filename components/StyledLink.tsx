import { Href, Link, LinkProps } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";

export type StyledLinkProps = PropsWithChildren & LinkProps & {
  href: Href<string>,
};

export default function StyledLink ({ children, href, style }: StyledLinkProps) {
  const theme = useColorScheme();
  return (
    <Link 
      href={href} 
      asChild
      style={[
        styles.container, 
        { backgroundColor: theme == 'dark' ?  'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)'},
        style,
      ]} >
      <Pressable>
        <ThemedText type='defaultSemiBold' style={{ textAlign: 'center' }}> { children } </ThemedText> 
      </Pressable>
    </Link>
        
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 8,
    borderStyle: 'dashed',
    borderWidth: 3,
    borderColor: '#FF7D70',
    borderRadius: 16,
  },
});

export const StyledLinkStyles = styles.container;