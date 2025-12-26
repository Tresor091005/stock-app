import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Order } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { index as ordersIndex, show as ordersShow } from '@/routes/orders';
import { format } from 'date-fns';

type Props = {
    order: Order;
}

export default function Show({ order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Orders',
            href: ordersIndex().url,
        },
        {
            title: `Order #${order.id}`,
            href: ordersShow({ order: order.id }).url,
        },
    ];

    const formattedTotal = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(order.total_amount);

    const formattedDate = format(new Date(order.created_at), 'PPP p');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Order #{order.id}</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                                        <p className="font-semibold">#{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</p>
                                        <p className="font-semibold">{formattedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
                                        <p className="text-lg font-bold">{formattedTotal}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text_gray-500 dark:text-gray-400">Status</p>
                                        <Badge variant={
                                            order.status === 'completed' ? 'default'
                                            : order.status === 'processing' ? 'secondary'
                                            : 'outline'
                                        } className="capitalize">{order.status}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-center">Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.product.name}</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold">{order.user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
