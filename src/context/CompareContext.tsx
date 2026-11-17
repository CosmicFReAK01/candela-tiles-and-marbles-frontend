"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicProduct } from "@/types";

interface CompareContextType {
  compareItems: PublicProduct[];
  compareCount: number;
  addToCompare: (product: PublicProduct) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: PublicProduct) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  maxCompareLimit: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = "candela_compare_products_v1";
const MAX_COMPARE_LIMIT = 4;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<PublicProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        setCompareItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load compare items from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
    } catch (e) {
      console.warn("Failed to save compare items to localStorage:", e);
    }
  }, [compareItems, isLoaded]);

  const addToCompare = (product: PublicProduct): boolean => {
    if (compareItems.some((item) => item.id === product.id)) {
      return true;
    }
    if (compareItems.length >= MAX_COMPARE_LIMIT) {
      alert(`You can compare a maximum of ${MAX_COMPARE_LIMIT} items at a time.`);
      return false;
    }
    setCompareItems((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleCompare = (product: PublicProduct) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => item.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        maxCompareLimit: MAX_COMPARE_LIMIT,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
