import { type Product } from '@/types';
import { useCartContext } from '@/providers/cart-provider';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductCartActionsProps {
    product: Product;
    disabled?: boolean;
}

export function ProductCartActions({ product, disabled }: ProductCartActionsProps) {
    const { updateQuantity, cartItems } = useCartContext();
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const cartItem = cartItems.find((item) => item.product.id === product.id);
    const quantityInCart = cartItem?.quantity ?? 0;
    const maxQuantityCanAdd = product.stock_quantity - quantityInCart;

    const handleAddToCart = async () => {
        if (quantityToAdd > 0 && !isAdding && !disabled) {
            const actualQuantityToAdd = Math.min(quantityToAdd, maxQuantityCanAdd);

            if (actualQuantityToAdd <= 0) {
                toast.error("Cannot add more, product is out of stock or you have reached the maximum available.");
                return;
            }

            setIsAdding(true);
            try {
                const newTotalQuantity = quantityInCart + actualQuantityToAdd;
                await updateQuantity(product.id, newTotalQuantity);
                setQuantityToAdd(1);
            } catch (error) {
                toast.error("Erreur lors de l'ajout au panier");
            } finally {
                setIsAdding(false);
            }
        }
    };

    return (
        <div className="w-full space-y-2">
            {quantityInCart > 0 && (
                <div className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in fade-in-0 zoom-in-75">
                    {quantityInCart}
                </div>
            )}
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={quantityToAdd}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setQuantityToAdd(Math.max(1, Math.min(value || 1, maxQuantityCanAdd)));
                    }}
                    className="h-9 w-16 text-center"
                    min="1"
                    max={maxQuantityCanAdd > 0 ? maxQuantityCanAdd : 1}
                    disabled={isAdding || disabled || maxQuantityCanAdd <= 0}
                />
                <Button
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isAdding || disabled || maxQuantityCanAdd <= 0}
                >
                    {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                </Button>
            </div>
        </div>
    );
}
