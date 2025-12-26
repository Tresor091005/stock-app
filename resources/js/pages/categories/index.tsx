import AppLayout from '@/layouts/app-layout';
import { 
    index as categoriesIndex, 
    create as categoriesCreate,
    edit as categoriesEdit,
    destroy as categoriesDestroy,
} from '@/routes/categories';
import { type BreadcrumbItem, type Category, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(categoriesDestroy({ category: category.id }).url);
        }
    }

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
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Slug</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCategories.data.map((category) => (
                                    <tr key={category.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{category.name}</td>
                                        <td className="px-6 py-4">{category.slug}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={categoriesEdit({ category: category.id }).url} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">Edit</Link>
                                            <button onClick={() => deleteCategory(category)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            {/* Basic Pagination */}
                            <div className="flex justify-between">
                                {paginatedCategories.prev_page_url && <Link href={paginatedCategories.prev_page_url}><Button>Previous</Button></Link>}
                                {paginatedCategories.next_page_url && <Link href={paginatedCategories.next_page_url}><Button>Next</Button></Link>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
