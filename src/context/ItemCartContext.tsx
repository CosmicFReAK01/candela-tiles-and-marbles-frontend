"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, PublicProduct } from "@/types";

interface ItemCartContextValue {
  cartItems: CartItem[];
  items: CartItem[]; // alias for cartItems
  wishlistIds: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isDrawerOpen: boolean; // alias for isCartOpen
  setIsDrawerOpen: (open: boolean) => void;
  addToCart: (
    product: PublicProduct,
    requestedSqft?: number,
    includeWastage10Percent?: boolean,
    applicationNote?: string
  ) => void;
  addOrUpdateItem: (
    product: PublicProduct,
    requestedSqft?: number,
    includeWastage10Percent?: boolean,
    applicationNote?: string
  ) => void; // alias
  removeFromCart: (productId: string) => void;
  removeItem: (productId: string) => void; // alias
  updateCartSqft: (productId: string, requestedSqft: number, includeWastage: boolean) => void;
  updateItemSqft: (productId: string, requestedSqft: number, includeWastage: boolean) => void; // alias
  clearCart: () => void;
  clearBasket: () => void; // alias
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalEffectiveSqft: number;
  totalBoxes: number;
  totalItemsCount: number;
  subtotalInr: number;
  toggleDrawer: () => void;
}

const ItemCartContext = createContext<ItemCartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "candela_item_cart_v2";
const WISHLIST_STORAGE_KEY = "candela_wishlist_v2";

export function calculateCoverage(
  requestedSqft: number,
  sqftPerBox: number,
  includeWastage10Percent: boolean
) {
  const cleanSqft = Math.max(10, Math.round(requestedSqft));
  const effectiveSqft = includeWastage10Percent
    ? Math.ceil(cleanSqft * 1.1)
    : cleanSqft;
  const estimatedBoxes = Math.max(1, Math.ceil(effectiveSqft / sqftPerBox));
  return { effectiveSqft, estimatedBoxes };
}

export function ItemCartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) setCartItems(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Failed to hydrate Item Cart / Wishlist", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  const addToCart = (
    product: PublicProduct,
    requestedSqft = 350,
    includeWastage10Percent = true,
    applicationNote = "Flooring / Feature Wall"
  ) => {
    const { effectiveSqft, estimatedBoxes } = calculateCoverage(
      requestedSqft,
      product.sqftPerBox,
      includeWastage10Percent
    );

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      const nextItem: CartItem = {
        product,
        quantity: 1,
        requestedSqft,
        includeWastage10Percent,
        effectiveSqft,
        estimatedBoxes,
        applicationNote,
        addedAt: new Date().toISOString(),
      };
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = nextItem;
        return copy;
      }
      return [...prev, nextItem];
    });
    setIsCartOpen(true);
  };

  const updateCartSqft = (
    productId: string,
    requestedSqft: number,
    includeWastage10Percent: boolean
  ) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        const { effectiveSqft, estimatedBoxes } = calculateCoverage(
          requestedSqft,
          item.product.sqftPerBox,
          includeWastage10Percent
        );
        return {
          ...item,
          requestedSqft,
          includeWastage10Percent,
          effectiveSqft,
          estimatedBoxes,
        };
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const totalEffectiveSqft = cartItems.reduce((sum, i) => sum + i.effectiveSqft, 0);
  const totalBoxes = cartItems.reduce((sum, i) => sum + i.estimatedBoxes, 0);
  const totalItemsCount = cartItems.length;
  const subtotalInr = cartItems.reduce(
    (sum, i) => sum + (i.product.pricePerSqftInr || 1450) * i.effectiveSqft,
    0
  );
  const toggleDrawer = () => setIsCartOpen((prev) => !prev);

  return (
    <ItemCartContext.Provider
      value={{
        cartItems,
        items: cartItems,
        wishlistIds,
        isCartOpen,
        setIsCartOpen,
        isDrawerOpen: isCartOpen,
        setIsDrawerOpen: setIsCartOpen,
        toggleDrawer,
        addToCart,
        addOrUpdateItem: addToCart,
        removeFromCart,
        removeItem: removeFromCart,
        updateCartSqft,
        updateItemSqft: updateCartSqft,
        clearCart,
        clearBasket: clearCart,
        toggleWishlist,
        isInWishlist,
        totalEffectiveSqft,
        totalBoxes,
        totalItemsCount,
        subtotalInr,
      }}
    >
      {children}
    </ItemCartContext.Provider>
  );
}

export function useItemCart() {
  const ctx = useContext(ItemCartContext);
  if (!ctx) {
    throw new Error("useItemCart must be used inside ItemCartProvider");
  }
  return ctx;
}

// Backwards-compatible hook export
export function useQuoteBasket() {
  return useItemCart();
}

export const QuoteBasketProvider = ItemCartProvider;
