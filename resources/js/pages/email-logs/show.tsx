import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type EmailLog } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index as emailLogsIndex, show as emailLogsShow } from '@/routes/email-logs';
import { format } from 'date-fns';

type Props = {
    emailLog: EmailLog;
}

export default function Show({ emailLog }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Email Logs',
            href: emailLogsIndex().url,
        },
        {
            title: emailLog.subject,
            href: emailLogsShow({ 'email_log': emailLog.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Email Log: ${emailLog.subject}`} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Email Log Details</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{emailLog.subject}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                            <p className="font-semibold">{emailLog.type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</p>
                            <p className="font-semibold">{emailLog.recipient}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sent At</p>
                            <p className="font-semibold">{format(new Date(emailLog.sent_at), 'PPP p')}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Content</p>
                            <div className="prose dark:prose-invert max-w-none rounded-lg border bg-muted p-4">
                                <p>{emailLog.content}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
