import databaseAPI from "@/apis/databaseAPI";
import { createContext, ReactElement, useContext, useEffect, useState } from "react";

export type TBusiness = {
  id: number,
  name: string;
  description: string;
  averageDeliveryTime: number,
  deliveryPrice: number,
  imageURL: string,
};

export const BusinessContext = createContext<{
  business: TBusiness[] | null,
  isLoading: boolean
}>({
  business: null,
  isLoading: false,
});

let DBbusiness: TBusiness[] = [];

export function useBusiness() {
  const [business, setBusiness] = useState<TBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function () {
      if (business.length > 0) return;
      DBbusiness = (await databaseAPI().getBusiness())
      setBusiness(DBbusiness);
      setIsLoading(false);
    })();
  }, []);
  return { business, isLoading};
}

export function BusinessProvider({ children }: { children: ReactElement}) {
  const {business, isLoading} = useBusiness();
  return (
    <BusinessContext.Provider
      value={{
        business,
        isLoading,
      }}>
        {children}
    </BusinessContext.Provider>
    );
}

