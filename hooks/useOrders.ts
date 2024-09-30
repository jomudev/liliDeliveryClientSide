import feedback from "@/util/feedback";
import { useEffect, useReducer, useRef, useState } from "react";
import { Alert } from "react-native";

export type TOrderProduct = {
  id: number,
  name: string,
  description: string,
  imageURL: string,
  price: number,
  branchId: number,
  businessId: number,
  quantity: number,
}

export type TProductComplement = {
  productId: number;
  name: string,
  description: string,
  price: string,
}

export type TOrder = {
  product: TOrderProduct[],
  productComplements: TProductComplement[],
  total: number,

}

export const ORDER_ACTION_TYPES = {
  ADD_ORDER: 'add',
  REMOVE_ORDER: 'remove',
  MODIFY_ORDER: 'modify',
  CLEAR: 'clear',
};

function orderReducer (order: TOrderProduct[], action: { type: string, data: any}) {
  let newOrder: TOrderProduct[];
  if (action.type == ORDER_ACTION_TYPES.ADD_ORDER) {
    newOrder = order.concat(action.data);
    return newOrder;
  }
  if (action.type === ORDER_ACTION_TYPES.REMOVE_ORDER) {
    newOrder = order.filter((product) => product.id !== action.data);
    return newOrder;
  }
  if (action.type == ORDER_ACTION_TYPES.MODIFY_ORDER) {
    newOrder = order.map((product) => product.id == action.data.id ? action.data : product);
    return newOrder; 
  }
  if (action.type == ORDER_ACTION_TYPES.CLEAR) {
    newOrder = [];
    return newOrder;
  }
  return order;
}

let orderSubtotal = 0;

export default function useOrder() {
  const businessOrder = useRef<number | null>(null);
  const [order, dispatch] = useReducer(orderReducer, []);
  const [subtotal, setSubtotal] = useState(0);

  function clearOrder() {
    dispatch({
      type: ORDER_ACTION_TYPES.CLEAR,
      data: null,
    });
    businessOrder.current = null;
  }

  function addProductToOrder(product: TOrderProduct) {
    if (!businessOrder.current) businessOrder.current = product.branchId;
    if (!businessOrder.current) return;
    if (businessOrder.current != product.branchId) {
      let userSelectNo: boolean = false;
      Alert.alert('Clear Cart?', 'You have an order from another business, did you want to clear the cart?', [
        {
          text: 'Yes, clear the cart',
          onPress: () => {
            clearOrder();

          },
        },
        {
          text: 'No',
          onPress: () => {
            userSelectNo = true;
          }
        }
      ]);
      if (userSelectNo) return;
    };
    
    if (order.find((prod: TOrderProduct) => prod.id == product.id)) 
      return
    
    dispatch({
      type: ORDER_ACTION_TYPES.ADD_ORDER,
      data: product,
    });
  }

  function removeProductFromOrder(productId: number) {
    if (order.length < 2) businessOrder.current = null;

    dispatch({
      type: ORDER_ACTION_TYPES.REMOVE_ORDER,
      data: productId,
    });
  }

  function modifyOrderProduct(product: TOrderProduct) {
    dispatch({
      type: ORDER_ACTION_TYPES.MODIFY_ORDER,
      data: product,
    });
  }

  useEffect(() => {
    orderSubtotal = order.reduce((prev, current) => prev + (current.price * current.quantity), 0);
    setSubtotal(orderSubtotal);
  }, [order]);

  return { 
    order, 
    orderSubtotal: subtotal, 
    clearOrder,
    addProductToOrder, 
    removeProductFromOrder, 
    modifyOrderProduct 
  };
}