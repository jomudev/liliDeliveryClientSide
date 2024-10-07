import OrderBanner from "@/components/OrderBanner";
import useOrder, { TOrderProduct } from "@/hooks/useOrders";
import { createContext, type PropsWithChildren } from "react";

export const OrderContext = createContext<{ 
  order: TOrderProduct[], 
  orderSubtotal: number, 
  businessOrder: number | null,
  clearOrder: () => void,
  addProductToOrder: (product: TOrderProduct) => void, 
  removeProductFromOrder: (productId: number) => void, 
  modifyOrderProduct: (product: TOrderProduct) => void, 
}>({
  order: [],
  orderSubtotal: 0,
  businessOrder: null,
  clearOrder: () => {},
  addProductToOrder: () => {},
  removeProductFromOrder: () => {},
  modifyOrderProduct: () => {},
});

export function OrderProvider ({ children }: PropsWithChildren) {
  const value = useOrder();
  
  return (
    <OrderContext.Provider value={value} >
      { children }
      <OrderBanner {...value} />
    </OrderContext.Provider>
  );
};

