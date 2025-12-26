import { type Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCartActions } from '@/components/carts/product-cart-actions';
import { Link } from '@inertiajs/react';
import { show as productsShow } from '@/routes/products';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

const formattedPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);

export function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = product.stock_quantity === 0;

    return (
        <Card className={`flex flex-col relative group ${isOutOfStock ? 'opacity-50' : ''}`}>
            <Link
                href={productsShow({ product: product.id }).url}
                className={`flex flex-col flex-grow ${isOutOfStock ? 'pointer-events-none' : ''}`}
            >
                <CardHeader>
                    <CardTitle className="group-hover:text-primary">{product.name}</CardTitle>
                    <CardDescription>{product.category.name}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="overflow-hidden rounded-md">
                        <img
                            src={getImageUrl(product.image) || 'https://via.placeholder.com/150'}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                    </div>
                    <p className="text-lg font-semibold mt-4">{formattedPrice(product.price)}</p>
                    {product.stock_quantity > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            In stock: {product.stock_quantity}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow line-clamp-2">
                        {product.description}
                    </p>
                </CardContent>
            </Link>
            <CardFooter>
                <ProductCartActions product={product} disabled={isOutOfStock} />
            </CardFooter>
        </Card>
    );
}
