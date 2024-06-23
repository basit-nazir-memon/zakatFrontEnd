'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Beneficiary {
  id: string;
  name: string;
  cnic: string;
  contact: string;
  city: string;
  area: string;
  monthlyExpense: number;
}

interface MonthlyExpensesTableProps {
  count?: number;
  page?: number;
  rows?: Beneficiary[];
  rowsPerPage?: number;
}

export function MonthlyExpensesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: MonthlyExpensesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((beneficiary) => beneficiary.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>CNIC</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Monthly Expense</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.cnic}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.monthlyExpense}</TableCell>
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
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}