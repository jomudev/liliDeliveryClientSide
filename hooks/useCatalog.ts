import databaseAPI from "@/apis/databaseAPI";
import ProductsAPI from "@/apis/ProductsAPI";
import { useCallback, useEffect, useRef, useState } from "react";

export type TProduct = {
  id: string;
  category: string;
  categoryId: number;
  description: string;
  name: string;
  imageURL: string;
  price: number;
  branchId: string;
  businessId: number;
};

export type TCatalog = {
  [index: string]: TProduct[];
};

const productsAPI = ProductsAPI();

export function useCatalog(branchId: string) {
  const [catalog, setCatalog] = useState<TCatalog>({});
  const ids = useRef<{ [index: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const currentBranchId = useRef(branchId);


  const loadMoreProducts = async (productsBranchId: string, page: number): Promise<number> => {
    const fetchedProducts = await productsAPI.getProductsWithPagination(productsBranchId.toString(), page, 10) || [];  
    setCatalog((prevCatalog) => ({
      ...fetchedProducts.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        ids.current[product.category] = product.categoryId;
        return acc;
      }, { ...prevCatalog }),
    }));
    return page + 1;
  };

  const getCatalog = useCallback(async () => {
    if (currentBranchId.current === branchId && Object.keys(catalog).length > 0) return;
    setIsLoading(true);
    currentBranchId.current = branchId;
    const preparedCatalog: TCatalog = {};
    const products = await productsAPI.getProductsWithPagination(branchId, 1, 10) || [];

    products.forEach((product: TProduct) => {
      if (!preparedCatalog[product.category]) {
        preparedCatalog[product.category] = [];
      }
      Object.entries(catalog).forEach(([category, products]) => {
        products.forEach((product) => {
          let productExist = products.find((p) => p.id === product.id);
          if (!productExist) {
            preparedCatalog[category].push(product);
          }
        });
      });
      ids.current[product.category] = product.categoryId;
    });
    setCatalog(preparedCatalog);
    setIsLoading(false);
  }, [branchId]);

  useEffect(() => {
    getCatalog();
  }, [getCatalog]);

  return { loadMoreProducts, catalog, categoryId: ids.current, isLoading, branchId };
}
