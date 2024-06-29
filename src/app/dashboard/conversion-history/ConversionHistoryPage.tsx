"use client";

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
import { useUser } from '@/hooks/use-user';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';

export default function ConversionHistoryPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [conversionHistory, setConversionHistory] = React.useState<ConversionHistory[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const { user } = useUser();

    React.useEffect(() => {
        const fetchConversionHistory = async () => {
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
                setConversionHistory(data);
            } catch (error) {
                console.error('Error fetching conversion history:', error);
            }
        };

        fetchConversionHistory();
    }, []);

    const filteredConversionHistory = conversionHistory.filter((record) =>
        record.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.depositor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record?.convert?.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedConversionHistory = applyPagination(filteredConversionHistory, page, rowsPerPage);

    const exportData = (format: 'excel' | 'pdf') => {
        if (format === 'excel') {
            const ws = XLSX.utils.json_to_sheet(filteredConversionHistory);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "ConversionHistory");

            const today = new Date();
            const dateString = today.toLocaleDateString();
            const timeString = today.toLocaleTimeString();
            const dateTimeString = `${dateString} ${timeString}`;

            wb.Props = {
                Title: "Conversion History Report",
                Subject: "Conversion History Data",
                CreatedDate: today
            };

            XLSX.writeFile(wb, "ConversionHistory.xlsx");
        } else if (format === 'pdf') {
            const doc = new jsPDF({ orientation: 'landscape' });

            const today = new Date();
            const dateString = today.toLocaleDateString();
            const timeString = today.toLocaleTimeString();
            const dateTimeString = `${dateString} ${timeString}`;

            doc.text("Conversion History Report", 14, 10);
            doc.text(`Generated on: ${dateTimeString}`, 14, 18);

            doc.autoTable({
                head: [['Amount', 'Date', 'Currency', 'Type', 'Depositor', 'Conversion Date', 'Conversion Rate', 'Conversion Currency', 'Total Amount', 'Reason']],
                body: filteredConversionHistory.map(history => [
                    history.amount,
                    dayjs(history.date).format('MMM D, YYYY'),
                    history.currency,
                    history.type,
                    history.depositor,
                    history?.convert?.date ? dayjs(history.convert.date).format('MMM D, YYYY') : '-',
                    history?.convert?.rate ? history.convert.rate : '-',
                    history?.convert?.currency ? history.convert.currency : '-',
                    history?.amount && history?.convert?.rate ? history.amount * history.convert.rate : '-',
                    history.reason
                ]),
                startY: 25
            });

            doc.save("ConversionHistory.pdf");
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
                    <Typography variant="h4">Conversion History</Typography>
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
                        <AddConversionHistoryButton />
                    </div>
                )}
            </Stack>
            <ConversionHistoryFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ConversionHistoryTable
                count={filteredConversionHistory.length}
                page={page}
                rows={paginatedConversionHistory}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
            />
        </Stack>
    );
}

function applyPagination(rows: ConversionHistory[], page: number, rowsPerPage: number): ConversionHistory[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
