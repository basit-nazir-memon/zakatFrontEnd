'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { User, UsersTable } from '@/components/dashboard/users/users-table';
import { UsersFilters } from '@/components/dashboard/users/users-filters';
import { AddUserButton } from './AddUserButton';
import { envConfig } from '../../../../env';

export default function UsersPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<User[]>([]);

    const paginatedUsers = applyPagination(users, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch(`${envConfig.url}/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Users</Typography>
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
            <AddUserButton/>
            </div>
        </Stack>
        <UsersFilters />
        <UsersTable
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

function applyPagination(rows: User[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
