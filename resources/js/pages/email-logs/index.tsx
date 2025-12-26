import AppLayout from '@/layouts/app-layout';
import { index as emailLogsIndex } from '@/routes/email-logs';
import { type BreadcrumbItem, type PaginatedResponse } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColumns } from '@/components/email-logs/columns';
import { DataTable } from '@/components/ui/data-table';
import { EmailLog } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Email Logs',
        href: emailLogsIndex().url,
    },
];

type Props = {
    emailLogs: PaginatedResponse<EmailLog>;
}

export default function Index({ emailLogs: paginatedEmailLogs }: Props) {
    const columns = getColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email Logs" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Email Logs</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Log List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} paginatedData={paginatedEmailLogs} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
