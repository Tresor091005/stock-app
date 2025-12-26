import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { type CartItem as CartItemType } from '@/hooks/use-cart';

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
}

export function CartItem({ item, updateQuantity, removeFromCart }: CartItemProps) {
    const [quantity, setQuantity] = useState(item.quantity);
    const debouncedQuantity = useDebounce(quantity, 500);

    useEffect(() => {
        if (debouncedQuantity !== item.quantity) {
            updateQuantity(item.product_id, debouncedQuantity);
        }
    }, [debouncedQuantity, item.quantity, item.product_id, updateQuantity]);

    const formattedPrice = (price: number) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

    return (
        <div className="flex items-center gap-4 py-4">
            <img 
                src={item.product.image ? `/storage/${item.product.image}` : `https://via.placeholder.com/64`} 
                alt={item.product.name} 
                className="h-16 w-16 rounded-md object-cover" 
            />
            <div className="flex-grow">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">{formattedPrice(item.product.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value)))} 
                        className="w-16 h-8" 
                    />
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeFromCart(item.product_id)}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}
