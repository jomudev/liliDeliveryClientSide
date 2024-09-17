import databaseAPI from "@/apis/databaseAPI";
import { useEffect, useRef, useState } from "react";

export type TProduct = {
  id: number,
  category: string,
  categoryId: number,
  description: string,
  name: string,
  imageURL: string,
  price: number,
  branchId: number,
}

export type TCatalog = {
  [index: string]: TProduct[];
}

export function useCatalog(businessId: string) {
  const [catalog, setCatalog] = useState({});
  const ids = useRef<{[index: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async function () {
      let preparedCatalog: TCatalog = {};
      const products = await databaseAPI().getBusinessProducts(businessId) || [];
      products.forEach((product: TProduct) => {
        preparedCatalog[product.category] = preparedCatalog[product.category] ? preparedCatalog[product.category].concat(product) : [product];
        ids.current[product.category] = product.categoryId; 
      });
      setCatalog(preparedCatalog);
      if (isLoading) setIsLoading(false);
    })();
  }, []);
  return { catalog, categoryId: ids.current, isLoading };
}