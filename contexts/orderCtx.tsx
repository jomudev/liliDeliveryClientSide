import OrderBanner from "@/components/OrderBanner";
import useOrder, { TOrderProduct } from "@/hooks/useOrders";
import React from "react";
import { createContext, type PropsWithChildren } from "react";
import { Alert } from "react-native";

export const OrderContext = createContext<{ 
  order: TOrderProduct[], 
  orderSubtotal: number, 
  branchOrder: string | undefined,
  clearOrder: () => void,
  addProductToOrder: (product: TOrderProduct) => void, 
  removeProductFromOrder: (productId: string) => void, 
  modifyOrderProduct: (product: TOrderProduct) => void, 
}>({
  order: [],
  orderSubtotal: 0,
  branchOrder: '',
  clearOrder: () => {},
  addProductToOrder: () => {},
  removeProductFromOrder: () => {},
  modifyOrderProduct: () => {},
});

export function OrderProvider ({ children }: PropsWithChildren) {
  const value = useOrder();
  return (
    <OrderContext.Provider 
      value={value} >
      { children }
      <OrderBanner {...value} />
    </OrderContext.Provider>
  );
};

