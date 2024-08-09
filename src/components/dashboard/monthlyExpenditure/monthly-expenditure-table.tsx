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
import { useUser } from '@/hooks/use-user';
import { Button, CircularProgress } from '@mui/material';
import { Money, Share, X } from '@phosphor-icons/react/dist/ssr';
import { Check } from '@phosphor-icons/react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { envConfig } from '../../../../env';

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
  expense: number;
  type: string;
  isPaid: boolean;
}

interface MonthlyExpensesTableProps {
  count?: number;
  page?: number;
  rows?: Beneficiary[];
  rowsPerPage?: number;
  setPage?: (page: number) => void;
  setRowsPerPage?: (rowsPerPage: number) => void;
  setRows?: (beneficiaries: Beneficiary[]) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export function MonthlyExpensesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  setPage = () => {},
  setRowsPerPage = () => {},
  setRows = () => {}
}: MonthlyExpensesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((beneficiary) => beneficiary.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const { user, error, isLoading } = useUser();
  const [message, setMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleClickSnackbar = () => {
    setOpen(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };

  const handleClick = async (beneficiaryId: string) => {
    try {
      setLoading(beneficiaryId);  // Start loading
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${envConfig.url}/beneficiaries/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ beneficiaryId }),
      });
  
      if (!response.ok) {
        throw new Error('Payment failed');
      }
  
      handleClickSnackbar();
      setMessage("Payment Successful");
      
      // Update the state to set isPaid to true for the respective beneficiary
      const newRows = rows.map((row) =>
        row.id === beneficiaryId ? { ...row, isPaid: true } : row
      );
      setRows(newRows);
  
    } catch (error) {
      handleClickSnackbar();
      setMessage('Error Occurred: ' + error?.message);
    } finally {
      setLoading(null);  // Stop loading
    }
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
              <TableCell>Name</TableCell>
              <TableCell>CNIC</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Expense</TableCell>
              <TableCell>Type</TableCell>
              { user?.role == "Admin" ? <TableCell>Payment</TableCell> : '' }
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
                  <TableCell>{row.expense}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  {
                    user?.role == "Admin" ? 
                        row?.type == "None" ? (
                          <TableCell>
                            <Button
                              startIcon={<X fontSize="var(--icon-fontSize-md)" />}
                              variant="contained"
                              disabled
                            >
                              Paid
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell>
                            <Button
                              startIcon={row.isPaid ? <Check fontSize="var(--icon-fontSize-md)" /> : <Share fontSize="var(--icon-fontSize-md)" />}
                              variant="contained"
                              onClick={() => handleClick(row.id)}
                              disabled={row.isPaid || loading === row.id}
                            >
                              {loading === row.id ? (
                                <CircularProgress size={24} />
                              ) : row.isPaid ? "Paid" : "Pay"}
                            </Button>
                          </TableCell>
                        ) : ''
                  }
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

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={message.includes("Error") ? "error" : "success"} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

    </Card>
  );
}
