import databaseAPI from "@/apis/databaseAPI";
import { useEffect, useState } from "react";

export function useCatalog(businessId: string) {
  const [catalog, setCatalog] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async function () {
      const categories = await databaseAPI().getBusinessCategories(businessId) || [];
      categories.forEach(async (category) => {
        let categoryProducts = await databaseAPI().getCategoryProducts(category.id, businessId);
        setCatalog((prev) => {
          if (!categoryProducts && !categoryProducts?.length) return prev;
          return { ...prev, [category.name]: categoryProducts };
        });
      });
      if (isLoading) setIsLoading(false);
    })();
  }, []);
  return { catalog, isLoading };
}