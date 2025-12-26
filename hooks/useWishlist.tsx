"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "athenas-wishlist";

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load wishlist from localStorage
 */
function loadWishlistFromStorage(): string[] {
  if (typeof window === "undefined" || !isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }
    // Invalid data structure, clear and return empty
    localStorage.removeItem(STORAGE_KEY);
    console.warn("Invalid wishlist data in localStorage, cleared.");
    return [];
  } catch {
    // JSON parse error or other issue
    localStorage.removeItem(STORAGE_KEY);
    console.warn("Corrupted wishlist data in localStorage, cleared.");
    return [];
  }
}

/**
 * Save wishlist to localStorage
 */
function saveWishlistToStorage(wishlist: string[]): void {
  if (typeof window === "undefined" || !isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  } catch {
    console.warn("Failed to save wishlist to localStorage.");
  }
}

// Store for useSyncExternalStore
let listeners: Array<() => void> = [];
let cachedWishlist: string[] | null = null;

// Cached empty array for server snapshot to avoid infinite loop
const EMPTY_WISHLIST: string[] = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): string[] {
  if (cachedWishlist === null) {
    cachedWishlist = loadWishlistFromStorage();
  }
  return cachedWishlist;
}

function getServerSnapshot(): string[] {
  return EMPTY_WISHLIST;
}

function emitChange(newWishlist: string[]) {
  cachedWishlist = newWishlist;
  saveWishlistToStorage(newWishlist);
  listeners.forEach((listener) => listener());
}

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const wishlist = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Add a product to the wishlist
  const addToWishlist = useCallback((productId: string) => {
    const current = getSnapshot();
    // Prevent duplicates
    if (current.includes(productId)) {
      return;
    }
    const updated = [...current, productId];
    emitChange(updated);
  }, []);

  // Remove a product from the wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    const current = getSnapshot();
    const updated = current.filter((id) => id !== productId);
    emitChange(updated);
  }, []);

  // Toggle a product in the wishlist
  const toggleWishlist = useCallback((productId: string) => {
    const current = getSnapshot();
    const isInList = current.includes(productId);
    const updated = isInList
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    emitChange(updated);
  }, []);

  // Check if a product is in the wishlist
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  // Clear all items from the wishlist
  const clearWishlist = useCallback(() => {
    emitChange([]);
  }, []);

  // Compute wishlist count
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount,
      clearWishlist,
    }),
    [
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

// Export storage key and helper functions for testing purposes
export { STORAGE_KEY, loadWishlistFromStorage, saveWishlistToStorage };
