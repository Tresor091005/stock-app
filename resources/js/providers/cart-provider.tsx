import { createContext, useContext, ReactNode } from 'react';
import { useCart, CartItem } from '@/hooks/use-cart';

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const cart = useCart();
    return (
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
}
