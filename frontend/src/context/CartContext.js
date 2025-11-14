import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext({
  cart: { items: [], total: 0 },
  refresh: async () => {},
  add: async (menuItemId, quantity) => {},
  update: async (itemId, quantity) => {},
  remove: async (itemId) => {}
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { token } = useAuth();

  async function refresh() {
    if (!token) {
      setCart({ items: [], total: 0 });
      return;
    }
    try {
      const data = await CartAPI.get();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function add(menuItemId, quantity = 1) {
    try {
      const data = await CartAPI.add(menuItemId, quantity);
      setCart(data);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function update(itemId, quantity) {
    try {
      const data = await CartAPI.updateItem(itemId, quantity);
      setCart(data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove(itemId) {
    try {
      const data = await CartAPI.deleteItem(itemId);
      setCart(data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <CartContext.Provider value={{ cart, refresh, add, update, remove }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}