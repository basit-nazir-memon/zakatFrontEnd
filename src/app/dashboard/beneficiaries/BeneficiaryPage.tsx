'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { AddBeneficiaryButton } from './AddBeneficiaryButton';
import { BeneficiaryFilters } from '@/components/dashboard/beneficiary/beneficiary-filters';
import { Beneficiary, BeneficiaryTable } from '@/components/dashboard/beneficiary/beneficiary-table';
import { envConfig } from '../../../../env';

export default function BeneficiaryPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [beneficiary, setBeneficiary] = React.useState<Beneficiary[]>([]);

    const paginatedBeneficiary = applyPagination(beneficiary, page, rowsPerPage);

    React.useEffect(() => {
        const fetchBeneficiary = async () => {
            const token : string | null = localStorage.getItem('auth-token')
        try {
            const response = await fetch(`${envConfig.url}/beneficiaries`, {
            headers: {
                'Authorization': `Bearer ${token}` // Replace with actual token
            }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch beneficiaries');
            }
            const data = await response.json();
            setBeneficiary(data);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
        }
        };

        fetchBeneficiary();
    }, []);

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Beneficiaries</Typography>
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
            <AddBeneficiaryButton />
            </div>
        </Stack>
        <BeneficiaryFilters />
        <BeneficiaryTable
            count={beneficiary.length}
            page={page}
            rows={paginatedBeneficiary}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
        />
        </Stack>
    );
}

function applyPagination(rows: Beneficiary[], page: number, rowsPerPage: number): Beneficiary[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
