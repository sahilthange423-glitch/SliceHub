import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Pizza, CartItem, Order, UserRole } from '../types.ts';
import { MENU_ITEMS, MOCK_ORDERS } from '../constants.ts';

interface StoreContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  
  cart: CartItem[];
  addToCart: (pizza: Pizza) => void;
  removeFromCart: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;

  orders: Order[];
  placeOrder: (details: Omit<Order, 'id' | 'status' | 'date' | 'userId' | 'items' | 'total'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  menu: Pizza[];
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS as Order[]); // Cast for simplicity
  const [menu] = useState<Pizza[]>(MENU_ITEMS);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Cart Logic
  const addToCart = (pizza: Pizza) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id);
      if (existing) {
        return prev.map(item => item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Order Logic
  const placeOrder = (details: any) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      userId: user?.id || 'guest',
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      date: new Date().toISOString(),
      ...details
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Auth Logic
  const login = (name: string, role: UserRole) => {
    setUser({
      id: role === 'admin' ? 'admin-1' : `user-${Math.floor(Math.random() * 1000)}`,
      name,
      email: `${name.toLowerCase()}@example.com`,
      role
    });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      orders, placeOrder, updateOrderStatus,
      menu,
      isAuthModalOpen, setAuthModalOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};