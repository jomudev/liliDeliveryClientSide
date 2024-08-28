import databaseAPI from "@/apis/databaseAPI";
import { createContext, useContext, useEffect } from "react";

export type TBusiness = {
  name: string;
  description: string;
  averageDeliveryTime: number,
  deliveryPrice: number,
};

export const BusinessContext = createContext<{
  business: TBusiness[] | null,
}>({
  business: null,
});

export function useBusiness() {
  const [business, setBusiness] = useState(null);
  useEffect(() => {
    databaseAPI().getBusiness().then(business => setBusiness(business));
  }, []);
  return [business];
}