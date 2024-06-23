"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { envConfig } from '../../../../../env';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { Anchor } from '@phosphor-icons/react';
import Link from 'next/link';

const ClientComponent = ({ id }) => {
    const [beneficiary, setBeneficiary] = React.useState(null);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                setError("No auth token found");
                return;
            }

            try {
                const response = await fetch(`${envConfig.url}/beneficiaries/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch beneficiary');
                }

                const data = await response.json();
                setBeneficiary(data);

                console.log(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, [id]);

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h4">Beneficiary Details</Typography>
            </div>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={3}>
                    <Grid lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Personal Information" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Name</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{beneficiary?.name}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">CNIC</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{beneficiary?.CNIC}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Gender</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{beneficiary?.gender}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Phone</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{beneficiary?.ContactNumber}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">City</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{beneficiary?.City}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={4} xs={4}>
                                            <Typography variant="subtitle1">Area</Typography>
                                        </Grid>
                                        <Grid md={8} xs={8}>
                                            <Typography variant="body1">{beneficiary?.Area}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Family Information" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Number of Sons</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.familyInfo?.son}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Number of Daughter</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.familyInfo?.daughter}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Number of Dependents / Adopted Child</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.familyInfo?.adopted}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid lg={12} md={12} xs={12}>
                        <Card>
                            <CardHeader title="Terms Information" />
                            <Divider />
                            <CardContent>
                                {
                                    (beneficiary?.Term.length > 0) ? 
                                        beneficiary?.Term.map((term, idx) => {
                                            return (
                                            <Grid lg={6} md={12} xs={12}>
                                                <Card>
                                                    <CardHeader title={`Term ${idx}`} />
                                                    <Divider />
                                                    <CardContent>
                                                        <Grid container spacing={3}>
                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Person Status</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{term?.status ? term?.status : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Payment Type</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{term?.type ? term?.type : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Start Date</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{term?.startDate ? term?.startDate : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">End Date</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{term?.endDate ? term?.endDate : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Closure Reason</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{term?.endDate ? term?.startDate : 'Not Closed'}</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={12} xs={12}>
                                                                    <Typography variant="subtitle1">Amount Terms (Payment Changes)</Typography>
                                                                    {
                                                                        term?.amountTerms ? (
                                                                            term?.amountTerms.map((amtTerm, amtIdx) => {
                                                                                return (
                                                                                    <Card style={{width: '100%', marginTop: '10px'}}>
                                                                                        <CardHeader title={<Typography variant="subtitle1">Amount Term {amtIdx}</Typography>} />
                                                                                        <Divider/>
                                                                                        <CardContent>
                                                                                            <Grid container md={12} xs={12}>
                                                                                                <Grid md={4} xs={4}>
                                                                                                    <Typography variant="subtitle1">Amount Change Reason</Typography>
                                                                                                </Grid>
                                                                                                <Grid md={8} xs={8}>
                                                                                                    <Typography variant="body1">{amtTerm?.reason ? amtTerm?.reason : '-' }</Typography>
                                                                                                </Grid>
                                                                                            </Grid>

                                                                                            <Grid container md={12} xs={12}>
                                                                                                <Grid md={4} xs={4}>
                                                                                                    <Typography variant="subtitle1">Amount Change</Typography>
                                                                                                </Grid>
                                                                                                <Grid md={8} xs={8}>
                                                                                                    <Typography variant="body1">{amtTerm?.amountChange ? amtTerm?.amountChange : '-' }</Typography>
                                                                                                </Grid>
                                                                                            </Grid>

                                                                                            <Grid container md={12} xs={12}>
                                                                                                <Grid md={4} xs={4}>
                                                                                                    <Typography variant="subtitle1">Amount Change Date</Typography>
                                                                                                </Grid>
                                                                                                <Grid md={8} xs={8}>
                                                                                                    <Typography variant="body1">{amtTerm?.date ? amtTerm?.date : '-'}</Typography>
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                )
                                                                            })
                                                                        ) : "No Amount Terms"
                                                                    }
                                                                </Grid>
                                                            </Grid>




                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )})
                                        : "No Term Records Exist"
                                    
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    
                    <Grid lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Family Information" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Number of Sons</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.familyInfo?.son}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Number of Daughter</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.familyInfo?.daughter}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Number of Dependents / Adopted Child</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.familyInfo?.adopted}</Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid lg={12} md={12} xs={12}>
                        <Card>
                            <CardHeader title="Financial Assistance" />
                            <Divider />
                            <CardContent>
                                {
                                    (beneficiary?.extraFA.length > 0) ? 
                                        beneficiary?.extraFA.map((fa, idx) => {
                                            return (
                                            <Grid lg={6} md={12} xs={12}>
                                                <Card>
                                                    <CardContent>
                                                        <Grid container spacing={3}>
                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Reason</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{fa?.reason ? fa?.reason : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Amount</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{fa?.amount ? fa?.amount : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Date</Typography>
                                                                </Grid>
                                                                <Grid md={8} xs={8}>
                                                                    <Typography variant="body1">{fa?.date ? fa?.date : '-'}</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container md={12} xs={12}>
                                                                <Grid md={4} xs={4}>
                                                                    <Typography variant="subtitle1">Proof</Typography>
                                                                </Grid>
                                                                {
                                                                    fa?.picProof ?
                                                                        (fa?.picProof as any[]).map((proof, index) => {
                                                                            return (                                                                                
                                                                                <Grid md={8} xs={8}>
                                                                                    <Link href={proof}>Pic {index}</Link>
                                                                                </Grid>
                                                                            )
                                                                        }
                                                                    ) : "No Proof"
                                                                }
                                                                
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )})
                                        : "No FA Records Exists"
                                    
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Additional Information" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Profession</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.profession}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Payment Mode</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.modeOfPayment ? beneficiary?.modeOfPayment : '-'}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Bank</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.bank ? beneficiary?.bank : '-'}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Account Number</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.accountNumber ? beneficiary?.accountNumber : '-'}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container md={12} xs={12}>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="subtitle1">Alive</Typography>
                                        </Grid>
                                        <Grid md={6} xs={6}>
                                            <Typography variant="body1">{beneficiary?.isAlive ? "Yes" : "No"}</Typography>
                                        </Grid>
                                    </Grid>

                                    {beneficiary?.isAlive ? '' :
                                        (
                                            <Grid container md={12} xs={12}>
                                                <Grid md={6} xs={6}>
                                                    <Typography variant="subtitle1">Death Date</Typography>
                                                </Grid>
                                                <Grid md={6} xs={6}>
                                                    <Typography variant="body1">{beneficiary?.deathDate ? beneficiary?.deathDate : '-'}</Typography>
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
};

export default ClientComponent;
