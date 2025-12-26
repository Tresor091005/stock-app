import AppLayout from '@/layouts/app-layout';
import { 
    index as usersIndex, 
} from '@/routes/users';
import { type BreadcrumbItem, type User, type PaginatedResponse } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColumns } from '@/components/users/columns';
import { DataTable } from '@/components/ui/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersIndex().url,
    },
];

type Props = {
    users: PaginatedResponse<User>;
}

export default function Index({ users: paginatedUsers }: Props) {
    const columns = getColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} paginatedData={paginatedUsers} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
