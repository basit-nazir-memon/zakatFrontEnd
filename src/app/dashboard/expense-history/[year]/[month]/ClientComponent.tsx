"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { envConfig } from '../../../../../../env';
import { Card, CardContent, CardHeader, Divider, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';

interface ClientComponentProps {
    month: string;
    year: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ month, year }) => {
    const [expenseRecords, setExpenseRecords] = React.useState({});
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                setError("No Auth token found");
                return;
            }

            try {
                const response = await fetch(`${envConfig.url}/expense-history/${year}/${month}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch expense History');
                }

                const data = await response.json();
                setExpenseRecords(data);

                console.log(data);
            } catch (error) {
                console.error('Error fetching Expense History:', error);
                setError('Failed to fetch Expense History');
            }
        };

        fetchData();
    }, [month, year]);

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h4">Expense History Details {`(${month} - ${year})`}</Typography>
            </div>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={3}>
                    <Grid lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Expense Information" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Month</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{expenseRecords.month}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Year</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{expenseRecords.year}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Total Amount</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{`PKR ${expenseRecords?.amount}`}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid lg={12} md={12} xs={12}>
                        <Card>
                            <CardHeader title="Expense / Transactions Details" />
                            <Divider />
                            <CardContent>
                                {
                                    expenseRecords?.details?.length > 0 ? (
                                        <Card>
                                            <Box sx={{ overflowX: 'auto' }}>
                                                <Table sx={{ minWidth: '800px' }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Amount</TableCell>
                                                            <TableCell>Transaction Details</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {expenseRecords?.details.map((row) => {
                                                            return (
                                                                <TableRow hover key={`${row.year}-${row.month}`}>
                                                                    <TableCell>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
                                                                    <TableCell>{row.amount}</TableCell>
                                                                    <TableCell>{row.details}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Card>
                                    ) : 'No Transcations / Records Yet'
                                }
                                
                            </CardContent>
                        </Card>
                    </Grid>
                    
                </Grid>
            )}
        </Stack>
    );
};

export default ClientComponent;
