'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: number;
  name: string;
  descriptor: string;
  price: number;
  quantity: number;
  image_path: string;
  length: number;
  width: number;
  height: number;
  uses: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'intermountain-dumpsters-cart';

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Calculate totals whenever items change
  useEffect(() => {
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    setCart(prev => ({
      ...prev,
      total,
      itemCount,
    }));
  }, [cart.items]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existingItem = prev.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prev.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        return { ...prev, items: updatedItems };
      } else {
        // Add new item with quantity 1
        const newItem: CartItem = { ...item, quantity: 1 };
        return { ...prev, items: [...prev.items, newItem] };
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  }, []);

  const getItemQuantity = useCallback((itemId: number) => {
    const item = cart.items.find(item => item.id === itemId);
    return item?.quantity || 0;
  }, [cart.items]);

  const isInCart = useCallback((itemId: number) => {
    return cart.items.some(item => item.id === itemId);
  }, [cart.items]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };
} 