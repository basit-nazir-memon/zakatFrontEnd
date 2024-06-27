import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Checkbox,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { useSelection } from '@/hooks/use-selection';
import { ExpenseHistoryTableButton } from './expense-history-table-button';

export interface ExpenseRecord {
    id: string;
    year: number;
    month: string;
    amount: number;
}

interface ExpenseTableProps {
    count?: number;
    page?: number;
    rows?: ExpenseRecord[];
    rowsPerPage?: number;
    setPage?: (page: number) => void;
    setRowsPerPage?: (rowsPerPage: number) => void;
}

export function ExpenseTable({
    count = 0,
    rows = [],
    page = 0,
    rowsPerPage = 0,
    setPage = () => {},
    setRowsPerPage = () => {}
}: ExpenseTableProps): React.JSX.Element {
    const rowIds = React.useMemo(() => rows.map((record) => `${record.year}-${record.month}`), [rows]);
    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
    const selectedAll = rows.length > 0 && selected?.size === rows.length;

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell>Month</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            const isSelected = selected?.has(`${row.year}-${row.month}`);
                            return (
                                <TableRow hover key={`${row.year}-${row.month}`} selected={isSelected}>
                                    <TableCell>{row.year}</TableCell>
                                    <TableCell>{row.month}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>
                                        <ExpenseHistoryTableButton month={row.month} year={`${row.year}`} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>

            <Divider />
            <TablePagination
                component="div"
                count={count}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
}
