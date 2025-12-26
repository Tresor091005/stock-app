import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Order, type User, type Product } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { sendDailySalesReport } from '@/routes/commands';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Stat {
    totalRevenue: number;
    salesCount: number;
    customersCount: number;
    productsCount: number;
}

interface RecentOrder extends Omit<Order, 'user'> {
    user: User;
}

type DashboardProps = {
    stats: Stat;
    recentOrders: RecentOrder[];
    lowStockProducts: Product[];
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export default function Dashboard({ stats, recentOrders, lowStockProducts }: DashboardProps) {
    const { auth } = usePage().props as any;
    const is_admin = auth.user?.role === 'admin';

    const { post, processing } = useForm();

    const handleSendDailyReport = () => {
        post(sendDailySalesReport().url, {
            onSuccess: (page: any) => {
                toast.success(page.props.flash.message || 'Daily sales report command triggered successfully.');
            },
            onError: (errors: any) => {
                toast.error(errors.message || 'Failed to trigger daily sales report command.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{stats.salesCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{stats.customersCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.productsCount}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentOrders.map((order) => (
                                    <div className="flex items-center" key={order.id}>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={order.user.avatar} alt="Avatar" />
                                            <AvatarFallback>{order.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{order.user.name}</p>
                                            <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            +{formatCurrency(order.total_amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Low Stock Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div className="flex items-center" key={product.id}>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={product.image ? `/storage/${product.image}`: `https://via.placeholder.com/150`} alt={product.name} />
                                            <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {product.category.name}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-destructive">
                                            {product.stock_quantity} in stock
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {is_admin && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-full">
                            <CardHeader>
                                <CardTitle>Admin Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleSendDailyReport} disabled={processing}>
                                    {processing ? 'Sending...' : 'Send Daily Sales Report'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
