'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Divider, MenuItem, Select } from '@mui/material';
import { envConfig } from '../../../../env';

const schema = zod.object({
    reason: zod.string().min(1, { message: 'Reason is required' }),
    amount: zod.number().min(1, { message: 'Amount must be positive' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
    reason: '',
    amount: 0,
};

export function AddExpenditureForm(): React.JSX.Element {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            try {
                const response = await fetch(`${envConfig.url}/extraexpenditures/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Adding Expenditure failed');
                }

                setSuccessMessage('Expenditure added successfully!');

                // Redirect after a short delay to show the success message
                setTimeout(() => {
                    router.push('/dashboard/extra-expenditures');
                }, 2000);

            } catch (error) {
                setError('root', { type: 'server', message: error?.message });
                setIsPending(false);
            }
        },
        [router, setError]
    );

    return (
        <Stack spacing={3}>
            <Stack spacing={1}>
                <Typography variant="h4">Add New Expenditure</Typography>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>

                    <Controller
                        control={control}
                        name="reason"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.reason)}>
                                <InputLabel>Reason</InputLabel>
                                <OutlinedInput {...field} label="Reason" />
                                {errors.reason ? <FormHelperText>{errors.reason.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.amount)}>
                                <InputLabel>Amount</InputLabel>
                                <OutlinedInput {...field} label="Amount" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                {errors.amount ? <FormHelperText>{errors.amount.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <br />
                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
                    <Button disabled={isPending} type="submit" variant="contained">
                        Add Expenditure
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
