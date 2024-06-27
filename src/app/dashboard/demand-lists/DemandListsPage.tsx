'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { envConfig } from '../../../../env';
import { DemandList, DemandListTable } from '@/components/dashboard/demandList/demand-list-table';
import { AddDemandListButton } from './AddDemandListsButton';
import { DemandListFilters } from '@/components/dashboard/demandList/demand-list-filters';

export default function DemandListsPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<DemandList[]>([]);

    const paginatedUsers = applyPagination(users, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('auth-token');
        try {
            const response = await fetch(`${envConfig.url}/demand-lists`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch demand lists');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching demand lists:', error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Demand Lists</Typography>
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
                <AddDemandListButton />
            </div>
        </Stack>
        <DemandListFilters />
        <DemandListTable
            count={users.length}
            page={page}
            rows={paginatedUsers}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
        />
        </Stack>
    );
}

function applyPagination(rows: DemandList[], page: number, rowsPerPage: number): DemandList[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
