import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
    index as productsIndex, 
    show as productsShow,
    edit as productsEdit,
} from '@/routes/products';
import { ProductCartActions } from '@/components/carts/product-cart-actions';

type Props = {
    product: Product;
}

export default function Show({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: productsIndex().url,
        },
        {
            title: product.name,
            href: productsShow({ product: product.id }).url,
        },
    ];

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(product.price);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                    <div className="flex items-center space-x-2">
                        <Link href={productsEdit({ product: product.id }).url}>
                            <Button>Edit Product</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                                        <p className="text-lg font-semibold">{formattedPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</p>
                                        <p className="text-lg font-semibold">{product.stock_quantity}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                                    <p className="text-lg font-semibold">{product.category.name}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative">
                            <CardHeader>
                                <CardTitle>Add to Cart</CardTitle>
                            </CardHeader>
                            <CardFooter>
                                <ProductCartActions product={product} />
                            </CardFooter>
                        </Card>
                    </div>
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.image ? (
                                <img src={`/storage/${product.image}`} alt={product.name} className="w-full h-auto object-cover rounded-md" />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-md">
                                    <p className="text-gray-500 dark:text-gray-400">No Image</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
