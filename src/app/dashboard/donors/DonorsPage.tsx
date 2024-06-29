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
    const [donors, setDonors] = React.useState<Donor[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const { user } = useUser();

    React.useEffect(() => {
        const fetchDonors = async () => {
            const token = localStorage.getItem('auth-token');
            try {
                const response = await fetch(`${envConfig.url}/donors`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch donors');
                }
                const data = await response.json();
                setDonors(data);
            } catch (error) {
                console.error('Error fetching donors:', error);
            }
        };

        fetchDonors();
    }, []);

    const filteredDonors = donors.filter((donor) =>
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedDonors = applyPagination(filteredDonors, page, rowsPerPage);

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Donors</Typography>
                    {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Import
                        </Button>
                        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Export
                        </Button>
                    </Stack> */}
                </Stack>
                {user?.role === "Admin" && (
                    <div>
                        <AddDonorButton />
                    </div>
                )}
            </Stack>
            <DonorsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <DonorsTable
                count={filteredDonors.length}
                page={page}
                rows={paginatedDonors}
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
