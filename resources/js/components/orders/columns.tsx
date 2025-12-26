import { type ColumnDef } from '@tanstack/react-table';
import { type Order, type User } from '@/types';
import { Button } from '@/components/ui/button';
import { Link, router, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { destroy as ordersDestroy, show as ordersShow, updateStatus as ordersUpdateStatus } from '@/routes/orders';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function ActionsCell({ order }: { order: Order }) {
    const { auth } = usePage().props as any;
    const user = auth.user as User;
    const is_admin = user.role === 'admin';
    const is_owner = user.id === order.user_id;

    // UI logic based on new rules
    const show_process = is_admin && order.status === 'pending';
    const show_complete_cancel = is_admin && order.status === 'processing';
    const show_delete = (is_admin || is_owner) && ['pending', 'cancelled'].includes(order.status);

    function handleStatusUpdate(status: string) {
        router.patch(
            ordersUpdateStatus({ order: order.id }).url,
            { status },
            { preserveScroll: true },
        );
    }

    function handleDelete() {
        router.delete(ordersDestroy({ order: order.id }).url, {
            preserveScroll: true,
        });
    }

    // An action is always available (at least the View action)
    const hasStatusActions = show_process || show_complete_cancel;
    const hasActions = hasStatusActions || show_delete;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={ordersShow({ order: order.id }).url}>View Details</Link>
                </DropdownMenuItem>
                {hasActions && <DropdownMenuSeparator />}
                {show_process && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate('processing')}>Mark as Processing</DropdownMenuItem>
                )}
                {show_complete_cancel && (
                    <>
                        <DropdownMenuItem onClick={() => handleStatusUpdate('completed')}>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate('cancelled')}>Mark as Cancelled</DropdownMenuItem>
                    </>
                )}
                {show_delete && (
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const getColumns = (): ColumnDef<Order>[] => [
    {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => `#${row.getValue('id')}`,
    },
    {
        accessorKey: 'user.name',
        header: 'Customer',
         cell: ({ row }) => {
            const order = row.original;
            return order.user?.name || 'N/A';
        },
    },
    {
        accessorKey: 'total_amount',
        header: 'Total',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('total_amount'));
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant: 'outline' | 'secondary' | 'default' =
                status === 'completed' ? 'default'
                : status === 'processing' ? 'secondary'
                : 'outline';
            return <Badge variant={variant} className="capitalize">{status}</Badge>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.getValue('created_at')), 'PPP'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell order={row.original} />,
    },
];
