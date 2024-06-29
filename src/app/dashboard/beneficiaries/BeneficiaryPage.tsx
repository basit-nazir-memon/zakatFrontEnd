"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { envConfig } from '../../../../env';
import { BeneficiaryFilters } from '@/components/dashboard/beneficiary/beneficiary-filters';
import { Beneficiary, BeneficiaryTable } from '@/components/dashboard/beneficiary/beneficiary-table';
import { useUser } from '@/hooks/use-user';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AddBeneficiaryButton } from './AddBeneficiaryButton';


export default function BeneficiaryPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [beneficiaries, setBeneficiaries] = React.useState<Beneficiary[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const { user } = useUser();

    React.useEffect(() => {
        const fetchBeneficiaries = async () => {
            const token : string | null = localStorage.getItem('auth-token');
            try {
                const response = await fetch(`${envConfig.url}/beneficiaries`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch beneficiaries');
                }
                const data = await response.json();
                setBeneficiaries(data);
            } catch (error) {
                console.error('Error fetching beneficiaries:', error);
            }
        };

        fetchBeneficiaries();
    }, []);

    const filteredBeneficiaries = beneficiaries.filter((record) =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.CNIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.City.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.Area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedBeneficiaries = applyPagination(filteredBeneficiaries, page, rowsPerPage);

    const exportData = (format: 'excel' | 'pdf') => {
        if (format === 'excel') {
            const ws = XLSX.utils.json_to_sheet(filteredBeneficiaries);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Beneficiaries");

            const today = new Date();

            wb.Props = {
                Title: "Beneficiaries Report",
                Subject: "Beneficiaries Data",
                CreatedDate: today
            };

            XLSX.writeFile(wb, "Beneficiaries.xlsx");
        } else if (format === 'pdf') {
            const doc = new jsPDF();

            const today = new Date();
            const dateString = today.toLocaleDateString();
            const timeString = today.toLocaleTimeString();
            const dateTimeString = `${dateString} ${timeString}`;

            doc.text("Beneficiaries Report", 14, 10);
            doc.text(`Generated on: ${dateTimeString}`, 14, 18);

            doc.autoTable({
                head: [['Name', 'CNIC', 'Gender', 'Status', 'City', 'Area']],
                body: filteredBeneficiaries.map(beneficiary => [
                    beneficiary.name,
                    beneficiary.CNIC,
                    beneficiary.gender,
                    beneficiary.isAlive ? 'Alive' : 'Deceased',
                    beneficiary.City,
                    beneficiary.Area
                ]),
                startY: 25
            });

            doc.save("Beneficiaries.pdf");
        }
    };

    const handleExportExcel = () => {
        exportData('excel');
    };

    const handleExportPDF = () => {
        exportData('pdf');
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Beneficiaries</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        {/* <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Import
                        </Button> */}
                        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleExportExcel}>
                            Export to Excel
                        </Button>
                        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleExportPDF}>
                            Export to PDF
                        </Button>
                    </Stack>
                </Stack>
                {user?.role === "Admin" && (
                    <div>
                        <AddBeneficiaryButton />
                    </div>
                )}
            </Stack>
            <BeneficiaryFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <BeneficiaryTable
                count={filteredBeneficiaries.length}
                page={page}
                rows={paginatedBeneficiaries}
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
