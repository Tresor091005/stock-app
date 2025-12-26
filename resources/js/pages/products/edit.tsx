import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category, type Product } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl } from '@/lib/utils';
import { 
    index as productsIndex, 
    edit as productsEdit,
    update as productsUpdate,
} from '@/routes/products';

type Props = {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: productsIndex().url,
        },
        {
            title: product.name,
            href: productsEdit({ product: product.id }).url,
        },
        {
            title: 'Edit',
            href: productsEdit({ product: product.id }).url,
        }
    ];

    const { data, setData, post, errors, processing } = useForm<{
        name: string;
        description: string;
        price: number;
        stock_quantity: number;
        category_id: string;
        image: File | null;
        _method: 'PUT';
    }>({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock_quantity: product.stock_quantity,
        category_id: String(product.category_id),
        image: null,
        _method: 'PUT',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(productsUpdate({ product: product.id }).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product: ${product.name}`} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
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

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                                            required
                                        />
                                        <InputError message={errors.price} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                        <Input
                                            id="stock_quantity"
                                            type="number"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', parseInt(e.target.value))}
                                            required
                                        />
                                        <InputError message={errors.stock_quantity} />
                                    </div>
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select onValueChange={(value) => setData('category_id', value)} value={data.category_id}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    />
                                    <InputError message={errors.image} />
                                </div>
                                
                                {product.image && !data.image && (
                                    <div className="grid gap-2">
                                        <Label>Current Image</Label>
                                        <img src={getImageUrl(product.image)} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Button type="submit" disabled={processing}>Save Changes</Button>
                                    <Link href={productsIndex().url}>
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
