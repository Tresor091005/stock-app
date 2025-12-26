import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartContext } from '@/providers/cart-provider';
import { store as ordersStore } from '@/routes/orders';
import { router, useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from './cart-item';

export function CartSheet() {
    const [open, setOpen] = useState(false);
    const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, fetchCartItems } = useCartContext();
    const { post, processing } = useForm();

    const formattedPrice = (price: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);

    function handleCheckout() {
        post(ordersStore().url, {
            preserveScroll: true,
            onSuccess: (page) => {
                fetchCartItems();
                if (page.props.success) {
                    setOpen(false);
                }
            },
        });
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group h-9 w-9 cursor-pointer">
                    <ShoppingCart className="!size-5 opacity-80 group-hover:opacity-100" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full">
                <SheetHeader className="p-6 pb-0">
                    <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto p-6">
                    {cartItems.length > 0 ? (
                        <div className="divide-y">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeFromCart={removeFromCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
                <div className="border-t pt-4 p-6">
                    <div className="flex justify-between font-bold">
                        <p>Subtotal</p>
                        <p>{formattedPrice(cartTotal)}</p>
                    </div>
                    <Button
                        className="w-full mt-4"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0 || processing}
                    >
                        {processing ? 'Processing...' : 'Checkout'}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}


