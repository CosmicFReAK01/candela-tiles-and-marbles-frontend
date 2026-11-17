"use client";

import { useMemo, useState } from "react";
import { AdminProduct, MasterCategory } from "@/types";
import { useCandelaStore } from "@/context/CandelaStoreContext";

export interface ProductFilterState {
  searchQuery: string;
  category: string;
  sortBy: "featured" | "price_asc" | "price_desc" | "name_asc";
  inStockOnly: boolean;
}

/**
 * Custom hook separating catalogue search, filtering, and sorting business logic
 */
export function useProducts(initialCategory: string = "all") {
  const { products, isLoaded } = useCandelaStore();
  const [filters, setFilters] = useState<ProductFilterState>({
    searchQuery: "",
    category: initialCategory,
    sortBy: "featured",
    inStockOnly: false,
  });

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Exclude items without an updated image
      if (!prod.media?.primaryImage || prod.media.primaryImage.trim() === "") {
        return false;
      }

      // Category filter
      if (filters.category !== "all") {
        const matchesMaster = prod.masterCategory === filters.category;
        const matchesCategory =
          prod.category?.toLowerCase() === filters.category.toLowerCase();
        if (!matchesMaster && !matchesCategory) return false;
      }

      // In Stock filter
      if (filters.inStockOnly && !prod.inStock) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesSku = prod.sku.toLowerCase().includes(query);
        const matchesCollection = prod.collectionName
          ?.toLowerCase()
          .includes(query);
        const matchesSubcategory = prod.subcategory
          ?.toLowerCase()
          .includes(query);
        if (!matchesName && !matchesSku && !matchesCollection && !matchesSubcategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return a.pricePerSqftInr - b.pricePerSqftInr;
        case "price_desc":
          return b.pricePerSqftInr - a.pricePerSqftInr;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filters]);

  const setCategory = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setSortBy = (sort: ProductFilterState["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy: sort }));
  };

  const toggleInStockOnly = () => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  return {
    products: filteredProducts,
    totalCount: products.length,
    filteredCount: filteredProducts.length,
    filters,
    isLoaded,
    setCategory,
    setSearchQuery,
    setSortBy,
    toggleInStockOnly,
    resetFilters: () =>
      setFilters({
        searchQuery: "",
        category: "all",
        sortBy: "featured",
        inStockOnly: false,
      }),
  };
}
