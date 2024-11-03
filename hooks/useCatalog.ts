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

export function useCatalog(businessId: string) {
  const [catalog, setCatalog] = useState<TCatalog>({});
  const ids = useRef<{ [index: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const currentBusinessId = useRef(businessId);


  const loadMoreProducts = async (branchId: string, page: number): Promise<number> => {
    const fetchedProducts = await productsAPI.getProductsWithPagination(branchId.toString(), page, 10) || [];  
    setCatalog((prevCatalog) => ({
      ...prevCatalog,
      ...fetchedProducts.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        ids.current[product.category] = product.categoryId;
        return acc;
      }, {}),
    }));
    return page + 1;
  };

  const getCatalog = useCallback(async () => {
    if (currentBusinessId.current === businessId && Object.keys(catalog).length > 0) return;

    setIsLoading(true);
    currentBusinessId.current = businessId;
    const preparedCatalog: TCatalog = {};
    const products = await productsAPI.getProductsWithPagination(businessId, 1, 10) || [];

    products.forEach((product: TProduct) => {
      if (!preparedCatalog[product.category]) {
        preparedCatalog[product.category] = [];
      }
      preparedCatalog[product.category].push(product);
      ids.current[product.category] = product.categoryId;
    });

    setCatalog(preparedCatalog);
    setIsLoading(false);
  }, [businessId]);

  useEffect(() => {
    getCatalog();
  }, [getCatalog]);

  return { loadMoreProducts, catalog, categoryId: ids.current, isLoading, businessId };
}
