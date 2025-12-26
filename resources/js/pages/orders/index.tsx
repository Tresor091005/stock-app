import AppLayout from '@/layouts/app-layout';
import { 
    index as ordersIndex, 
} from '@/routes/orders';
import { type BreadcrumbItem, type Order, type PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColumns } from '@/components/orders/columns';
import { DataTable } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: ordersIndex().url,
    },
];

type Props = {
    orders: PaginatedResponse<Order>;
}

export default function Index({ orders: paginatedOrders }: Props) {
    const columns = getColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} paginatedData={paginatedOrders} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
