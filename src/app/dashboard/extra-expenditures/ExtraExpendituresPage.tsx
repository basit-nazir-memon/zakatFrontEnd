'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { AddExtraExpenditureButton } from './AddExtraExpenditureButton';
import { envConfig } from '../../../../env';
import { ExtraExpenditure, ExtraExpenditureTable } from '@/components/dashboard/extraExpenditure/extra-expenditure-table';
import { ExtraExpensesFilters } from '@/components/dashboard/extraExpenditure/extra-expenditure-filters';

export default function ExtraExpendituresPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<ExtraExpenditure[]>([]);

    const paginatedUsers = applyPagination(users, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch(`${envConfig.url}/extraexpenditures`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch extra expenditures');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching extra expenditures:', error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Extra Expenditures</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
                </Button>
                <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
                </Button>
            </Stack>
            </Stack>
            <div>
                <AddExtraExpenditureButton />
            </div>
        </Stack>
        <ExtraExpensesFilters />
        <ExtraExpenditureTable
            count={paginatedUsers.length}
            page={page}
            rows={paginatedUsers}
            rowsPerPage={rowsPerPage}
        />
        </Stack>
    );
}

function applyPagination(rows: ExtraExpenditure[], page: number, rowsPerPage: number): ExtraExpenditure[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
