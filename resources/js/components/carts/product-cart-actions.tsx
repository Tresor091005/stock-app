import { type Product } from '@/types';
import { useCartContext } from '@/providers/cart-provider';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductCartActionsProps {
    product: Product;
}

export function ProductCartActions({ product }: ProductCartActionsProps) {
    const { updateQuantity, cartItems } = useCartContext();
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const cartItem = cartItems.find((item) => item.product.id === product.id);
    const quantityInCart = cartItem?.quantity ?? 0;

    const handleAddToCart = async () => {
        if (quantityToAdd > 0 && !isAdding) {
            setIsAdding(true);
            try {
                const newTotalQuantity = quantityInCart + quantityToAdd;
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
                    onChange={(e) => setQuantityToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 w-16 text-center"
                    min="1"
                    disabled={isAdding}
                />
                <Button 
                    className="flex-1" 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                >
                    {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                </Button>
            </div>
        </div>
    );
}
