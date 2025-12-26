import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '@/types';

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchCartItems() {
        try {
            setLoading(true);
            const response = await axios.get('/cart');
            setCartItems(response.data);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCartItems();
    }, []);

    async function updateQuantity(productId: number, quantity: number) {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev => {
            const existing = prev.find(item => item.product_id === productId);
            if (existing) {
                return prev.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity }
                        : item
                );
            }
            return prev;
        });

        try {
            await axios.put(`/cart/${productId}`, { quantity });
            fetchCartItems();
        } catch (error) {
            console.error('Failed to update quantity:', error);
            fetchCartItems();
        }
    }

    async function removeFromCart(productId: number) {
        try {
            await axios.delete(`/cart/${productId}`);
            fetchCartItems();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    }

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return {
        cartItems,
        cartCount,
        cartTotal,
        updateQuantity,
        removeFromCart,
        loading,
        fetchCartItems,
    };
}
