import { BusinessContext, TBusiness } from "@/contexts/businessCtx";
import BusinessCard from "./BusinessCard";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import LoadingIndicator from "./LoadingIndicator";
import CenteredText from "./CenteredText";

export default function Business() {
  const { business, isLoading } = useContext(BusinessContext);
  if (isLoading) {
    return <LoadingIndicator />
  }
  if (!business) return <CenteredText>Nothing to show here</CenteredText>;
  return business && business.map((business: TBusiness) => (
    <BusinessCard 
      key={business.id} 
      {...business}
      />
  ));
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignSelf: 'center',
  }
});