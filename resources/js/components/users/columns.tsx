import { type ColumnDef } from '@tanstack/react-table';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { show as usersShow } from '@/routes/users';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export const getColumns = (): ColumnDef<User>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => row.getValue('id'),
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => row.getValue('name'),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.getValue('email'),
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            return <Badge variant="secondary" className="capitalize">{role}</Badge>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => format(new Date(row.getValue('created_at')), 'PPP'),
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <Button variant="outline" size="sm" asChild>
                <Link href={usersShow({ user: row.original.id }).url}>
                    View Orders
                </Link>
            </Button>
        ),
    },
];