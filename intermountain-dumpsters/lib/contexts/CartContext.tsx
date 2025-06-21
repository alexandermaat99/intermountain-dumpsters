'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { DumpsterType, CartItem } from '@/lib/types';

type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
};

type CartContextType = {
  cart: CartState;
  addToCart: (dumpsterType: DumpsterType) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  isInCart: (itemId: number) => boolean;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCartState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => {
    if (typeof window === 'undefined') {
      return initialCartState;
    }
    try {
      const storedCart = window.localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : initialCartState;
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      return initialCartState;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage', error);
    }
  }, [cart]);

  const calculateCartState = (items: CartItem[]): CartState => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, itemCount, total };
  };

  const addToCart = (dumpsterType: DumpsterType) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.id === dumpsterType.id);
      let newItems;
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.id === dumpsterType.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.availableQuantity) }
            : item
        );
      } else {
        const newItem: CartItem = {
          ...dumpsterType,
          quantity: 1,
          availableQuantity: dumpsterType.quantity
        };
        newItems = [...prevCart.items, newItem];
      }
      return calculateCartState(newItems);
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, Math.min(quantity, item.availableQuantity));
          if (newQuantity === 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
      return calculateCartState(newItems);
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      return calculateCartState(newItems);
    });
  };

  const isInCart = (itemId: number) => {
    return cart.items.some(item => item.id === itemId);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
} 