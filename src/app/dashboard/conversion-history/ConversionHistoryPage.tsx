'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { envConfig } from '../../../../env';
import { ConversionHistory, ConversionHistoryTable } from '@/components/dashboard/conversionHistory/conversion-history-table';
import { AddConversionHistoryButton } from './AddConversionHistoryButton';
import { ConversionHistoryFilters } from '@/components/dashboard/conversionHistory/conversion-history-filters';

export default function ConversionHistoryPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<ConversionHistory[]>([]);

    const paginatedUsers = applyPagination(users, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${envConfig.url}/conversion-history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch conversion history');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching conversion History:', error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Conversion History</Typography>
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
                <AddConversionHistoryButton />
            </div>
        </Stack>
        <ConversionHistoryFilters />
        <ConversionHistoryTable
            count={paginatedUsers.length}
            page={page}
            rows={paginatedUsers}
            rowsPerPage={rowsPerPage}
        />
        </Stack>
    );
}

function applyPagination(rows: ConversionHistory[], page: number, rowsPerPage: number): ConversionHistory[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
