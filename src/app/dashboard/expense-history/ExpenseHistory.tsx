'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { envConfig } from '../../../../env';
import { ExpenseHistoryFilters } from '@/components/dashboard/expenseHistory/expense-history-filters';
import { ExpenseRecord, ExpenseTable } from '@/components/dashboard/expenseHistory/expense-history-table';
import { CircularProgress } from '@mui/material';

export default function ExpenseHistoryPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [expense, setExpense] = React.useState<ExpenseRecord[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        const fetchExpenses = async () => {
            const token : string | null = localStorage.getItem('auth-token');
            try {
                const response = await fetch(`${envConfig.url}/expenses-summary`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch expense history');
                }
                const data = await response.json();
                setExpense(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching expense history:', error);
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const filteredExpenses = expense.filter((record) =>
        record.year.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.month.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedExpenseHistory = applyPagination(filteredExpenses, page, rowsPerPage);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Expense History</Typography>
                    {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Import
                        </Button>
                        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Export
                        </Button>
                    </Stack> */}
                </Stack>
            </Stack>
            <ExpenseHistoryFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ExpenseTable
                count={filteredExpenses.length}
                page={page}
                rows={paginatedExpenseHistory}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
            />
        </Stack>
    );
}

function applyPagination(rows: ExpenseRecord[], page: number, rowsPerPage: number): ExpenseRecord[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
