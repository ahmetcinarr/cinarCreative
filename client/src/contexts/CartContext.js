import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Sepete eklemek için giriş yapmalısınız');
      return { success: false };
    }

    try {
      await axios.post('/api/cart', {
        productId,
        quantity
      });

      await fetchCart();
      toast.success('Ürün sepete eklendi');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Sepete eklenirken bir hata oluştu';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.put(`/api/cart/${productId}`, {
        quantity
      });

      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Sepet güncellenirken bir hata oluştu';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/${productId}`);
      await fetchCart();
      toast.success('Ürün sepetten kaldırıldı');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Sepetten kaldırılırken bir hata oluştu';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    try {
      const promises = cartItems.map(item => 
        axios.delete(`/api/cart/${item.product_id}`)
      );
      await Promise.all(promises);
      setCartItems([]);
      toast.success('Sepet temizlendi');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Sepet temizlenirken bir hata oluştu';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};