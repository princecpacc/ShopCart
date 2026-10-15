import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getCart,
  addToCart as addToCartRequest,
  updateCartQuantity as updateCartQuantityRequest,
  removeFromCart as removeFromCartRequest
} from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [itemsLoading, setItemsLoading] = useState({});

  const setItemLoading = (productId, value) => {
    setItemsLoading((current) => ({ ...current, [productId]: value }));
  };

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const cart = await getCart();
      setCartItems(cart);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setCartItems([]);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addItem(productId) {
    setItemLoading(productId, true);
    try {
      const cart = await addToCartRequest(productId);
      setCartItems(cart);
    } finally {
      setItemLoading(productId, false);
    }
  }

  async function updateQuantity(productId, quantity) {
    setItemLoading(productId, true);
    try {
      const cart = await updateCartQuantityRequest(productId, quantity);
      setCartItems(cart);
    } finally {
      setItemLoading(productId, false);
    }
  }

  async function removeItem(productId) {
    setItemLoading(productId, true);
    try {
      const cart = await removeFromCartRequest(productId);
      setCartItems(cart);
    } finally {
      setItemLoading(productId, false);
    }
  }

  function clearCart() {
    setCartItems([]);
  }

  const value = {
    cartItems,
    loading,
    error,
    itemsLoading,
    refreshCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
