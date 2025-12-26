import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { 
    index as categoriesIndex, 
    edit as categoriesEdit,
    update as categoriesUpdate,
} from '@/routes/categories';

type Props = {
    category: Category;
}

export default function Edit({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: categoriesIndex().url,
        },
        {
            title: category.name,
            href: categoriesEdit({ category: category.id }).url,
        },
        {
            title: 'Edit',
            href: categoriesEdit({ category: category.id }).url,
        }
    ];

    const { data, setData, put, errors, processing } = useForm({
        name: category.name,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(categoriesUpdate({ category: category.id }).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Category: ${category.name}`} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button type="submit" disabled={processing}>Save Changes</Button>
                                    <Link href={categoriesIndex().url}>
                                        <Button variant="outline">Cancel</Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
