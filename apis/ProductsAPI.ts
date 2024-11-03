import { apiFetch } from "./databaseAPI"; 
import { TProduct } from "@/hooks/useCatalog";

export default function ProductsAPI () {
  return {
    async getCategoryProducts (branchId: string, category: string, page: number, length: number): Promise<TProduct[]> {
      return await apiFetch(`/products/categoryProducts/${category}`, {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          pageNumber: page,
          length,
        }),
      }) || [];
    },
    async getProduct (id: number) {
      return apiFetch(`/products/${id}`);
    },
    async getProductsWithPagination (branchId: string, page: number, length: number): Promise<TProduct[]> {
      return apiFetch(`/products/productsWithPagination`, {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          pageNumber: page,
          length,
        }),
      }) || [];
    },    
  };
}