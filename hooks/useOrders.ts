import { TComplement } from "@/app/(app)/addComplement";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Alert } from "react-native";
import { TProduct } from "./useCatalog";
import { totalizeByProperty } from "@/util/totalizeByProperty";
import feedback from "@/util/feedback";

export type TOrderProduct = TProduct & {
  complements: TComplement[],
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
  SET_ORDER: 'set',
};

function orderReducer (order: TOrderProduct[], action: { type: string, data: any}) {
  let newOrder: TOrderProduct[];
  if (action.type == ORDER_ACTION_TYPES.SET_ORDER) {
    newOrder = action.data;
    return newOrder;
  }
  if (action.type == ORDER_ACTION_TYPES.ADD_ORDER) {
    if (order.find((product) => product.id == action.data.id)) return order;
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

async function saveBranchOrder(branchOrder: string | null) {
  if (!branchOrder) {
    return AsyncStorage.removeItem('@branchOrder');
  };
  return AsyncStorage.setItem('@branchOrder', JSON.stringify(branchOrder));
};

async function getBranchOrder() {
  try {
    let localBranchOrder = await AsyncStorage.getItem('@branchOrder') || 'null';
    return JSON.parse(localBranchOrder);
  } catch (error) {
    console.error(error);
    return '';
  }
};

export default function useOrder() {
  const branchOrder = useRef<string | null>(null);
  const [order, dispatch] = useReducer(orderReducer, []);
  const [subtotal, setSubtotal] = useState(0);

  const getOrder = useCallback(async () =>  {
    let storedOrderString = await AsyncStorage.getItem('@order');

    let parsedStoredOrder: TOrderProduct[] = Array.from(JSON.parse(storedOrderString || '[]'));
    const validOrder = parsedStoredOrder.filter((order) => Object.hasOwn(order, 'name')); 
    if (!validOrder.length) return [];
    return validOrder;
  }, []);

  useEffect(() => {
      getBranchOrder().then(localBranchOrder => {
        branchOrder.current = localBranchOrder;
      });
      getOrder().then(validOrder => {
        dispatch({
          type: ORDER_ACTION_TYPES.SET_ORDER,
          data: validOrder,
        });
      })
  }, []);

  useEffect(() => {
    orderSubtotal = order.reduce((prev, current) => prev + (
      (current.price + totalizeByProperty(current.complements, 'value')) * current.quantity
    ), 0);
    setSubtotal(orderSubtotal);
    AsyncStorage.setItem('@order', JSON.stringify(order));
    if (order.length == 0) {
      branchOrder.current = null;
      saveBranchOrder(null);
    }
    saveBranchOrder(order[0]?.branchId);
  }, [order]);

  function clearOrder() {
    dispatch({
      type: ORDER_ACTION_TYPES.CLEAR,
      data: null,
    });
    branchOrder.current = null;
  }

  function addProductToOrder(product: TOrderProduct) {
    if (!branchOrder.current) branchOrder.current = product.branchId;
    if (!branchOrder.current) return;
    if (branchOrder.current.toString() != product.branchId.toString()) {
      Alert.alert('Clear Cart?', 'You have an order from another business, did you want to clear the cart and set this order?', [
        {
          text: 'Yes, clear the cart',
          onPress: () => {
            clearOrder();
            branchOrder.current = product.branchId;
            dispatch({
              type: ORDER_ACTION_TYPES.ADD_ORDER,
              data: product,
            });
          },
        },
        {
          text: 'No',
          onPress: () => {}
        }
      ]);
    };
    dispatch({
      type: ORDER_ACTION_TYPES.ADD_ORDER,
      data: product,
    });
  }

  function removeProductFromOrder(productId: string) {
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

  return { 
    order, 
    orderSubtotal: subtotal, 
    branchOrder: branchOrder.current,
    clearOrder,
    addProductToOrder, 
    removeProductFromOrder, 
    modifyOrderProduct 
  };
}