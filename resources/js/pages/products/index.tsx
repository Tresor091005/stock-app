import AppLayout from '@/layouts/app-layout';
import { 
    index as productsIndex, 
    create as productsCreate,
    destroy as productsDestroy,
} from '@/routes/products';
import { type BreadcrumbItem, type Product, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColumns } from '@/components/products/columns';
import { DataTable } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productsIndex().url,
    },
];

type Props = {
    products: PaginatedResponse<Product>;
}

export default function Index({ products: paginatedProducts }: Props) {
    function deleteProduct(product: Product) {
        router.delete(productsDestroy({ product: product.id }).url);
    }

    const columns = getColumns({ deleteProduct });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <div className="flex items-center space-x-2">
                        <Link href={productsCreate().url}>
                            <Button>Create Product</Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} paginatedData={paginatedProducts} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
