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
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface ConversionHistory {
  id: string;
  amount: number;
  date: Date;
  currency: string;
  type: string;
  depositor: string;
  convert: {
    date: Date;
    rate: number;
    currency: string;
  };
  reason: string;
}

interface ConversionHistoryTableProps {
  count?: number;
  page?: number;
  rows?: ConversionHistory[];
  rowsPerPage?: number;
  setPage?: (page: number) => void;
  setRowsPerPage?: (rowsPerPage: number) => void;
}

export function ConversionHistoryTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  setPage = () => {},
  setRowsPerPage = () => {}
}: ConversionHistoryTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((history) => history.id);
  }, [rows]);

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
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Depositor</TableCell>
              <TableCell>Conversion Date</TableCell>
              <TableCell>Conversion Rate</TableCell>
              <TableCell>Conversion Currency</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Reason</TableCell>
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
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{dayjs(row.date).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.depositor}</TableCell>
                  <TableCell>{row?.convert?.date ? dayjs(row.convert.date).format('MMM D, YYYY') : '-'}</TableCell>
                  <TableCell>{row?.convert?.rate ? row.convert.rate : '-'}</TableCell>
                  <TableCell>{row?.convert?.currency ? row.convert.currency : '-'}</TableCell>
                  <TableCell>{row?.amount && row?.convert?.rate ? row.amount * row.convert.rate : '-'}</TableCell>
                  <TableCell>{row.reason}</TableCell>
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
