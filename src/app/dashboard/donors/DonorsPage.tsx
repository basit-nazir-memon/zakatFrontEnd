'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { DonorsFilters } from '@/components/dashboard/donors/donors-filters';
import { Donor, DonorsTable } from '@/components/dashboard/donors/donors-table';
import { AddDonorButton } from './AddDonorButton';
import { envConfig } from '../../../../env';
import { useUser } from '@/hooks/use-user';

export default function DonorsPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<Donor[]>([]);
    const { user, error, isLoading } = useUser();

    const paginatedUsers = applyPagination(users, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
        const token = localStorage.getItem('auth-token');
        try {
            const response = await fetch(`${envConfig.url}/donors`, {
            headers: {
                'Authorization': `Bearer ${token}` // Replace with actual token
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch donors');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching donors:', error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Donors</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
                </Button>
                <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
                </Button>
            </Stack>
            </Stack>
            { 
                user?.role == "Admin" ? (
                    <div>
                        <AddDonorButton/>
                    </div>
                ) : ''
            }
        </Stack>
        <DonorsFilters />
        <DonorsTable
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

function applyPagination(rows: Donor[], page: number, rowsPerPage: number): Donor[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
