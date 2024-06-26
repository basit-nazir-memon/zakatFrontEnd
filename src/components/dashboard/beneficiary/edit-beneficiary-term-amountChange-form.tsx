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
    amountTerms: zod.object({
        reason: zod.string().min(1, { message: 'Reason is required' }),
        amountChange: zod.number().optional(),
    }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
    amountTerms: {
        reason: '',
        amountChange: 0,
    }
} satisfies Values;

export function EditBeneficiaryAmountTermForm({ id }): React.JSX.Element {
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
                const response = await fetch(`${envConfig.url}/beneficiaries/amountterm/add/${id}`, {
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
                                    name="amountTerms.reason"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors?.amountTerms?.reason)}>
                                        <InputLabel>Amount Reason</InputLabel>
                                        <OutlinedInput {...field} label="Amount Reason" />
                                        {errors?.amountTerms?.reason ? <FormHelperText>{errors.amountTerms?.reason.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>                            
                                <Controller
                                    control={control}
                                    name="amountTerms.amountChange"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors?.amountTerms?.amountChange)}>
                                    <InputLabel>Amount (Monthly / Yearly)</InputLabel>
                                    <OutlinedInput {...field} label="Amount (Monthly / Yearly)" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                                    {errors?.amountTerms?.amountChange ? <FormHelperText>{errors?.amountTerms?.amountChange?.message}</FormHelperText> : null}
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
                            Save Amount Term Record
                        </Button>
                    </CardActions>
                </>
            </form>
        </Stack>
    );
}
