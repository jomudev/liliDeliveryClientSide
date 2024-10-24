import { BusinessContext, TBusiness } from "@/contexts/businessCtx";
import BranchCard from "./BranchCard";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import LoadingIndicator from "./LoadingIndicator";
import CenteredText from "./CenteredText";
import React from "react";

export default function Branches() {
  const { business, isLoading } = useContext(BusinessContext);
  if (isLoading) {
    return <LoadingIndicator />
  }
  if (!business) return <CenteredText>❌🏬 There's no business here</CenteredText>;
  return business && business.map((branch: TBusiness) => (
    <BranchCard 
      key={branch.id} 
      {...branch}
      />
  ));
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignSelf: 'center',
  }
});