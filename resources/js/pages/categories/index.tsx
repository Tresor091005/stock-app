import AppLayout from '@/layouts/app-layout';
import { 
    index as categoriesIndex, 
    create as categoriesCreate,
    destroy as categoriesDestroy,
} from '@/routes/categories';
import { type BreadcrumbItem, type Category, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColumns } from '@/components/categories/columns';
import { DataTable } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: categoriesIndex().url,
    },
];

type Props = {
    categories: PaginatedResponse<Category>;
}

export default function Index({ categories: paginatedCategories }: Props) {
    function deleteCategory(category: Category) {
        router.delete(categoriesDestroy({ category: category.id }).url);
    }

    const columns = getColumns({ deleteCategory });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <div className="flex items-center space-x-2">
                        <Link href={categoriesCreate().url}>
                            <Button>Create Category</Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} paginatedData={paginatedCategories} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
