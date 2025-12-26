import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type Order, type PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { index as usersIndex, show as usersShow } from '@/routes/users';
import { show as ordersShow } from '@/routes/orders';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui/data-table';
import { getColumns as getOrderColumns } from '@/components/orders/columns';
import { Badge } from '@/components/ui/badge';

type Props = {
    user: User;
    orders: PaginatedResponse<Order>;
}

export default function Show({ user, orders: paginatedOrders }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndex().url,
        },
        {
            title: user.name,
            href: usersShow({ user: user.id }).url,
        },
    ];

    const orderColumns = getOrderColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">User: {user.name}</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</p>
                                    <p className="font-semibold">{user.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                                    <p className="font-semibold">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-semibold">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered On</p>
                                    <p className="font-semibold">{format(new Date(user.created_at), 'PPP')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Orders</CardTitle>
                                <CardDescription>All orders placed by {user.name}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {paginatedOrders.data.length > 0 ? (
                                    <DataTable columns={orderColumns} paginatedData={paginatedOrders} />
                                ) : (
                                    <p>This user has not placed any orders yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
