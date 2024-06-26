'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Stack } from '@mui/system';
import { envConfig } from '../../../../env';

const schema = zod.object({
    Term: zod.object({
        status: zod.enum(['Widow', 'Orphan', 'Poor', 'Disabled', 'Patient', 'Student']),
        type: zod.enum(['Monthly', 'Yearly', 'Occasionally']),
        amountTerms: zod.array(zod.object({
            reason: zod.string().optional(),
            amountChange: zod.number().optional(),
            date: zod.string().optional(),
        })),
        closureReason: zod.string().optional(),
        startDate: zod.string().optional(),
        endDate: zod.string().optional(),
        isClosed: zod.boolean().optional(),
    }),
});


type Values = zod.infer<typeof schema>;

const defaultValues = {
    Term: {
        status: "Poor",
        type: "Monthly",
        amountTerms: [
            {
                reason: '',
                amountChange: 0,
                date: ''
            }
        ],
        closureReason: '',
        startDate: '',
        endDate: '',
        isClosed: false,
    }
} satisfies Values;

export function AddBeneficiaryTermForm({ id }): React.JSX.Element {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });


    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            const token = localStorage.getItem('auth-token');

            try {
                const response = await fetch(`${envConfig.url}/beneficiaries/term/add/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || data.error || 'Amount Term Addition failed');
                }

                setSuccessMessage('Amount Term Record Added successfully!');

            } catch (error) {
                setError('root', { type: 'server', message: error?.message });
                setIsPending(false);
            }
        },
        [router, setError]
    );

    return (
        <Stack spacing={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} xs={12}>
                                <Controller
                                    control={control}
                                    name="Term.status"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors.Term?.status)}>
                                        <InputLabel>Status</InputLabel>
                                        <Select {...field} label="Status">
                                        <MenuItem value="Widow">Widow</MenuItem>
                                        <MenuItem value="Orphan">Orphan</MenuItem>
                                        <MenuItem value="Poor">Poor</MenuItem>
                                        <MenuItem value="Disabled">Disabled</MenuItem>
                                        <MenuItem value="Patient">Patient</MenuItem>
                                        <MenuItem value="Student">Student</MenuItem>
                                        </Select>
                                        {errors.Term?.status ? <FormHelperText>{errors.Term.status.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <Controller
                                    control={control}
                                    name="Term.type"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors.Term?.type)}>
                                        <InputLabel>Type</InputLabel>
                                        <Select {...field} label="Type">
                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                        <MenuItem value="Yearly">Yearly</MenuItem>
                                        </Select>
                                        {errors.Term?.type ? <FormHelperText>{errors.Term.type.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <Controller
                                    control={control}
                                    name="Term.amountTerms[0].reason"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors?.Term?.amountTerms[0]?.reason)}>
                                        <InputLabel>Amount Reason</InputLabel>
                                        <OutlinedInput {...field} label="Amount Reason" />
                                        {errors?.Term?.amountTerms[0]?.reason ? <FormHelperText>{errors?.Term?.amountTerms[0]?.reason?.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>                            
                                <Controller
                                    control={control}
                                    name="Term.amountTerms[0].amountChange"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors?.Term?.amountTerms[0]?.amountChange)}>
                                    <InputLabel>Amount (Monthly / Yearly)</InputLabel>
                                    <OutlinedInput {...field} label="Amount (Monthly / Yearly)" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                                    {errors?.Term?.amountTerms[0]?.amountChange ? <FormHelperText>{errors?.Term?.amountTerms[0]?.amountChange?.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>

                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', margin: '10px' }}>
                        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                        {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
                        <Button disabled={isPending} type="submit" variant="contained">
                            Save Term Record
                        </Button>
                    </CardActions>
                </>
            </form>
        </Stack>
    );
}
