import AppLayout from '@/layouts/app-layout';
import { index as productsIndex } from '@/routes/products';
import { type BreadcrumbItem, type Product, type PaginatedResponse, type Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/shop/product-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productsIndex().url,
    },
];

type Props = {
    products: PaginatedResponse<Product>;
    categories: Category[];
    filters: { category?: string };
};

export default function Index({ products, categories, filters }: Props) {
    const handleCategoryFilter = (categoryId: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('category', categoryId);
        if (categoryId === 'all') {
            url.searchParams.delete('category');
        }
        url.searchParams.delete('page'); // Reset page to 1 when applying a new category filter
        router.get(url.toString(), {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shop" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Shop</h2>
                    <div className="w-64">
                        <Select onValueChange={handleCategoryFilter} value={filters.category || 'all'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-4 flex justify-center">
                    {/* Basic Pagination */}
                    <div className="flex gap-2">
                        {products.links.map((link, index) =>
                            link.url ? (
                                <Link key={index} href={link.url}>
                                    <Button
                                        variant={link.active ? 'default' : 'outline'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </Link>
                            ) : (
                                <Button
                                    key={index}
                                    variant="outline"
                                    disabled
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
