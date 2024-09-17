import { Href, Link } from "expo-router";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

export type StyledLinkProps = PropsWithChildren & {
  href: Href<string>,
};

export default function StyledLink ({ children, href }: StyledLinkProps) {
  return (
    <Link href={href} style={styles.container} > <ThemedText> { children } </ThemedText> </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 8,
    borderStyle: 'dashed',
    borderWidth: 3,
    borderColor: '#FF7D70',
    alignContent: 'center',
    borderRadius: 16,
  },
});