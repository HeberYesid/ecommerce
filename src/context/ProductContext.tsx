import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { mockProducts } from "../data/mockProducts";
import type { Product } from "../types";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let supabaseData: Product[] = [];
      const { data, error } = await supabase.from("products").select("*");

      if (!error && data) {
        // Ensure data matches Product type (supabase might return snake_case matching but verify types if needed)
        supabaseData = data as Product[];
      }

      const allProducts = [...mockProducts, ...supabaseData];

      // Remove duplicates by ID
      const unique: Product[] = [];
      const seen = new Set<string>();
      for (const p of allProducts) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          unique.push(p);
        }
      }

      setProducts(unique);
    } catch (e) {
      console.warn(
        "Fetch exception in ProductContext, falling back to mock data:",
        e,
      );
      setProducts([...mockProducts]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, refreshProducts: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
