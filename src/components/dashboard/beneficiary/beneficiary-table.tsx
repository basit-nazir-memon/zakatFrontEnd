'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useSelection } from '@/hooks/use-selection';
import { Button } from '@mui/material';
import { BeneficiaryTableButton } from './beneficiary-table-button';
import { BeneficiaryTableEditButton } from './beneficiary-table-edit-button';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

function noop(): void {
  // do nothing
}

export interface Beneficiary {
  _id: string;
  name: string;
  CNIC: string;
  gender: string;
  isAlive: boolean;
  City: string;
  Area: string;
}

interface BeneficiaryTableProps {
  count?: number;
  page?: number;
  rows?: Beneficiary[];
  rowsPerPage?: number;
  setPage?: (page: number) => void;
  setRowsPerPage?: (rowsPerPage: number) => void;
}

export function BeneficiaryTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  setPage = () => {},
  setRowsPerPage = () => {}
}: BeneficiaryTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((user) => user._id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const { user, error, isLoading } = useUser();

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
              <TableCell>Name</TableCell>
              <TableCell>CNIC</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Area</TableCell>
              
              {
                user?.role == "Admin" || user?.role == "Editor" ? (
                  <TableCell></TableCell>
                ) : ''
              }
              {
                user?.role == "Admin" ? (
                <TableCell></TableCell>
                ) : ''
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row._id);
                        } else {
                          deselectOne(row._id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{row?.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{row?.CNIC ? row?.CNIC : '-'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row?.gender}</TableCell>
                  <TableCell>{row?.isAlive ? 'Alive' : 'Deceased'}</TableCell>
                  <TableCell>{row?.City}</TableCell>
                  <TableCell>{row?.Area}</TableCell>
                  {
                    user?.role == "Admin" || user?.role == "Editor" ? (
                      <TableCell>
                        <BeneficiaryTableButton id={row._id}/>
                      </TableCell>
                    ) : ''
                  }
                  {
                    user?.role == "Admin" ? (
                      <TableCell>
                        <BeneficiaryTableEditButton id={row._id}/>
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
    </Card>
  );
}
