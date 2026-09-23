import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/menu";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | undefined;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  badge?: string | undefined;
}

interface WishlistValue {
  items: WishlistItem[];
  count: number;
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);
const STORAGE_KEY = "wazeer-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as WishlistItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<WishlistValue>(() => ({
    items,
    count: items.length,
    has: (id) => items.some((i) => i.id === id),
    toggle: (product) =>
      setItems((prev) => {
        const exists = prev.some((i) => i.id === product.id);
        if (exists) return prev.filter((i) => i.id !== product.id);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            rating: product.rating,
            reviews: product.reviews,
            description: product.description,
            badge: product.badge,
          },
        ];
      }),
    remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
