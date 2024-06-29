'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { envConfig } from '../../../../env';
import { MonthlyExpensesFilters } from '@/components/dashboard/monthlyExpenditure/monthly-expenditure-filters';
import { Beneficiary, MonthlyExpensesTable } from '@/components/dashboard/monthlyExpenditure/monthly-expenditure-table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function MonthlyExpendituresPage(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<Beneficiary[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.cnic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.monthlyExpense.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = applyPagination(filteredUsers, page, rowsPerPage);

    React.useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch(`${envConfig.url}/monthly-expenses`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
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

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "MonthlyExpenses");

        const today = new Date();
        const dateString = today.toLocaleDateString();
        const timeString = today.toLocaleTimeString();
        const dateTimeString = `${dateString} ${timeString}`;

        wb.Props = {
            Title: "Monthly Expenses Report",
            Subject: "Monthly Expenses Data",
            CreatedDate: today
        };

        XLSX.writeFile(wb, "MonthlyExpenses.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        const today = new Date();
        const dateString = today.toLocaleDateString();
        const timeString = today.toLocaleTimeString();
        const dateTimeString = `${dateString} ${timeString}`;

        doc.text("Monthly Expenses Report", 14, 10);
        doc.text(`Generated on: ${dateTimeString}`, 14, 18);

        doc.autoTable({
            head: [['Name', 'CNIC', 'Contact', 'City', 'Area', 'Monthly Expense']],
            body: filteredUsers.map(user => [
                user.name,
                user.cnic,
                user.contact,
                user.city,
                user.area,
                user.monthlyExpense
            ]),
            startY: 25
        });

        doc.save("MonthlyExpenses.pdf");
    };

    return (
        <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Monthly Expenditures</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {/* <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
                </Button> */}
                <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={exportToExcel}>
                Export to Excel
                </Button>
                <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={exportToPDF}>
                Export to PDF
                </Button>
            </Stack>
            </Stack>
        </Stack>
        <MonthlyExpensesFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <MonthlyExpensesTable
            count={filteredUsers.length}
            page={page}
            rows={paginatedUsers}
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
