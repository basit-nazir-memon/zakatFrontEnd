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
    type: zod.string().min(1, { message: 'Type is required' }),
    depositor: zod.string().min(1, { message: 'Depositor is required' }),
    currency: zod.string().min(1, { message: 'Currency is required' }),
    convert: zod.object({
        date: zod.date(),
        rate: zod.number().min(0, { message: 'Rate must be non-negative' }),
        currency: zod.string().min(1, { message: 'Currency is required' }),
    }).optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
    reason: '',
    amount: 0,
    type: 'Convert',
    depositor: '',
    currency: 'USD',
    convert: {
        date: new Date(),
        rate: 0,
        currency: 'USD',
    },
};

export function AddConversionForm(): React.JSX.Element {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const [showConversion, setShowConversion] = React.useState(true);

    const {
        control,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const termType = watch("type");

    React.useEffect(() => {
        if (termType === 'Convert') {
            setShowConversion(true);
        } else {
            setShowConversion(false);
        }
    }, [termType]);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            try {
                const response = await fetch(`${envConfig.url}/conversion-history`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Adding Conversion failed');
                }

                setSuccessMessage('Conversion added successfully!');

                // Redirect after a short delay to show the success message
                setTimeout(() => {
                    router.push('/dashboard/conversion-history');
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
                <Typography variant="h4">Add New Inflow / Conversion</Typography>
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

                    <Controller
                        control={control}
                        name="currency"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.currency)}>
                                <InputLabel>Currency</InputLabel>
                                <Select {...field} label="Currency">
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="PKR">PKR</MenuItem>
                                </Select>
                                {errors.currency ? <FormHelperText>{errors.currency.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.type)}>
                                <InputLabel>Type</InputLabel>
                                <Select {...field} label="Type">
                                    <MenuItem value="Convert">Convert</MenuItem>
                                    <MenuItem value="Receive">Receive</MenuItem>
                                </Select>
                                {errors.type ? <FormHelperText>{errors.type.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Controller
                        control={control}
                        name="depositor"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.depositor)}>
                                <InputLabel>Depositor</InputLabel>
                                <OutlinedInput {...field} label="Depositor" />
                                {errors.depositor ? <FormHelperText>{errors.depositor.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    {showConversion && (
                        <>
                            <Divider />
                            <Typography variant="h5">Conversion Details</Typography>

                            <Controller
                                control={control}
                                name="convert.date"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.convert?.date)}>
                                        <InputLabel>Conversion Date</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            label="Conversion Date"
                                            type="date"
                                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                field.onChange(selectedDate);
                                            }}
                                        />
                                        {errors.convert?.date ? <FormHelperText>{errors.convert?.date.message}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />



                            <Controller
                                control={control}
                                name="convert.rate"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.convert?.rate)}>
                                        <InputLabel>Conversion Rate</InputLabel>
                                        <OutlinedInput {...field} label="Conversion Rate" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                        {errors.convert?.rate ? <FormHelperText>{errors.convert?.rate.message}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />

                            <Controller
                                control={control}
                                name="convert.currency"
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.convert?.currency)}>
                                        <InputLabel>Conversion Currency</InputLabel>
                                        <Select {...field} label="Conversion Currency">
                                            <MenuItem value="USD">USD</MenuItem>
                                            <MenuItem value="PKR">PKR</MenuItem>
                                        </Select>
                                        {errors.convert?.currency ? <FormHelperText>{errors.convert?.currency.message}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                        </>
                    )}

                    <br />
                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
                    <Button disabled={isPending} type="submit" variant="contained">
                        Add Inflow / Conversion
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
