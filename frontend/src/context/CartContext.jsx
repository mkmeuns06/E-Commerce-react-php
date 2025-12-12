import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await cartService.addToCart(productId, quantity);
      await loadCart();
      toast.success('Produit ajouté au panier !');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, quantity) => {
    setLoading(true);
    try {
      await cartService.updateCart(productId, quantity);
      await loadCart();
      toast.success('Panier mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      await cartService.removeFromCart(productId);
      await loadCart();
      toast.success('Produit retiré du panier');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartService.clearCart();
      await loadCart();
      toast.success('Panier vidé');
    } catch (error) {
      toast.error('Erreur lors du vidage du panier');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    loading,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};