'use client';

import { type EmailLog } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { show } from '@/routes/email-logs';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

export const getColumns = (): ColumnDef<EmailLog>[] => {
    return [
        {
            accessorKey: 'type',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'recipient',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Recipient
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'subject',
            header: 'Subject',
        },
        {
            accessorKey: 'sent_at',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Sent At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return format(new Date(row.original.sent_at), 'PPP p');
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const emailLog = row.original;

                return (
                    <Link href={show({ 'email_log': emailLog.id }).url}>
                        <Button variant="outline" size="sm">
                            View
                        </Button>
                    </Link>
                );
            },
        },
    ];
};
