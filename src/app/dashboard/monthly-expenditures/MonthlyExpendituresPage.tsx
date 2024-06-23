'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { envConfig } from '../../../../env';
import { ExtraExpenditure, ExtraExpenditureTable } from '@/components/dashboard/extraExpenditure/extra-expenditure-table';
import { ExtraExpensesFilters } from '@/components/dashboard/extraExpenditure/extra-expenditure-filters';
import { MonthlyExpensesFilters } from '@/components/dashboard/monthlyExpenditure/monthly-expenditure-filters';
import { Beneficiary, MonthlyExpensesTable } from '@/components/dashboard/monthlyExpenditure/monthly-expenditure-table';

export default function MonthlyExpendituresPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<Beneficiary[]>([]);

    const paginatedUsers = applyPagination(users, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch(`${envConfig.url}/monthly-expenses`, {
            headers: {
                'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch monthly expenses');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching monthly expenses:', error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Monthly Expenditures</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
                </Button>
                <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
                </Button>
            </Stack>
            </Stack>
        </Stack>
        <MonthlyExpensesFilters />
        <MonthlyExpensesTable
            count={paginatedUsers.length}
            page={page}
            rows={paginatedUsers}
            rowsPerPage={rowsPerPage}
        />
        </Stack>
    );
}

function applyPagination(rows: Beneficiary[], page: number, rowsPerPage: number): Beneficiary[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
