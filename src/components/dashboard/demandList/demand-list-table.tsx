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
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';
import { Button } from '@mui/material';

function noop(): void {
  // do nothing
}

export interface DemandList {
  _id: string;
  Need: number;
  Reason: string;
  PersonId: {
    firstName: string;
    lastName: string;
  };
  isApproved: boolean;
  approvalDate: Date;
  creationDate: Date;
  viewers: {
    firstName: string;
    lastName: string;
  }[];
  Comments: {
    originator: {
      firstName: string;
      lastName: string;
      avatar: string;
    };
    comment: string;
    reply: {
      replier: {
        firstName: string;
        lastName: string;
        avatar: string;
      };
      reply: string;
    };
  }[];
}

interface DemandListTableProps {
  count?: number;
  page?: number;
  rows?: DemandList[];
  rowsPerPage?: number;
}

export function DemandListTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: DemandListTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((demand) => demand._id);
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
              <TableCell>Need</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>DemandList Creation Date</TableCell>
              <TableCell>Payment Approved</TableCell>
              <TableCell>Approval Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((demand) => {
              const isSelected = selected?.has(demand._id);

              return (
                <TableRow hover key={demand._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(demand._id);
                        } else {
                          deselectOne(demand._id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{demand?.Need}</TableCell>
                  <TableCell>{demand?.Reason}</TableCell>
                  <TableCell>{demand?.creationDate ? dayjs(demand?.creationDate).format('MMM D, YYYY') : '-' }</TableCell>
                  <TableCell>{demand?.isApproved ? 'Approved' : 'Not Approved'}</TableCell>
                  <TableCell>{demand.approvalDate ? dayjs(demand.approvalDate).format('MMM D, YYYY') : '-'}</TableCell>
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
