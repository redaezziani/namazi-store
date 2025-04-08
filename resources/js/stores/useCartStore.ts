import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart item interface
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  sku: string;
  addedAt?: number; // Timestamp for when the item was added
}

// Cart store interface
interface CartState {
  items: CartItem[];
  recentlyAdded: CartItem[]; // Track recently added items
  addItem: (item: Omit<CartItem, 'quantity' | 'addedAt'> & { quantity?: number }) => void;
  removeItem: (id: string | number, size?: string, color?: string) => void;
  updateQuantity: (id: string | number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (id: string | number, size?: string, color?: string) => number;
  isInCart: (id: string | number, size?: string, color?: string) => boolean;
  getRecentlyAdded: (count?: number) => CartItem[]; // Get recently added items
}

// Create the store with persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      recentlyAdded: [],

      // Add item to cart (or increase quantity if exists)
      addItem: (newItem) => {
        const { items, recentlyAdded } = get();
        const timestamp = Date.now();
        const existingItemIndex = items.findIndex(
          (item) =>
            item.id === newItem.id &&
            item.size === newItem.size &&
            item.color === newItem.color
        );

        // Create new item with timestamp
        const itemWithTimestamp = {
          ...newItem,
          quantity: newItem.quantity || 1,
          addedAt: timestamp
        };

        set((state) => {
          let updatedItems;

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            updatedItems[existingItemIndex].addedAt = timestamp; // Update timestamp
          } else {
            // New item, add to cart
            updatedItems = [...state.items, itemWithTimestamp];
          }

          // Keep track of recently added items (max 3)
          const newRecentlyAdded = [
            itemWithTimestamp,
            ...state.recentlyAdded.filter(
              item => !(
                item.id === newItem.id &&
                item.size === newItem.size &&
                item.color === newItem.color
              )
            )
          ].slice(0, 3);

          return {
            items: updatedItems,
            recentlyAdded: newRecentlyAdded
          };
        });
      },

      // Remove item from cart
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id &&
              item.size === size &&
              item.color === color)
          ),
          recentlyAdded: state.recentlyAdded.filter(
            (item) =>
              !(item.id === id &&
              item.size === size &&
              item.color === color)
          )
        }));
      },

      // Update item quantity
      updateQuantity: (id, quantity, size, color) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      // Clear the entire cart
      clearCart: () => set({ items: [], recentlyAdded: [] }),

      // Get total number of items in cart
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price of all items in cart
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      // Get quantity of specific item in cart
      getItemQuantity: (id, size, color) => {
        const { items } = get();
        const item = items.find(
          (item) =>
            item.id === id &&
            item.size === size &&
            item.color === color
        );
        return item ? item.quantity : 0;
      },

      // Check if item is in cart
      isInCart: (id, size, color) => {
        const { items } = get();
        return items.some(
          (item) =>
            item.id === id &&
            item.size === size &&
            item.color === color
        );
      },

      // Get the most recently added items
      getRecentlyAdded: (count = 3) => {
        return get().recentlyAdded.slice(0, count);
      },
    }),
    {
      name: 'cart-storage', // Name for the localStorage key
      partialize: (state) => ({
        items: state.items,
        recentlyAdded: state.recentlyAdded
      }), // Persist both items and recently added
    }
  )
);
