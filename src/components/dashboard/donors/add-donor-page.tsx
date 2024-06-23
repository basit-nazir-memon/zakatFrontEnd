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
    name: zod.string().min(1, { message: 'Name is required' }),
    country: zod.string().min(1, { message: 'Country is required' }),
    city: zod.string().min(1, { message: 'City is required' }),
    contactNumber: zod.string().min(1, { message: 'Contact Number is required' }),
    yearlyAmount: zod.array(zod.object({
        date: zod.string().min(1, { message: 'Date is required' }),
        amount: zod.number().min(1, { message: 'Amount is required' }),
        type: zod.enum(['Zakat', 'Sadqah', 'Fitra', 'Kherat'], { message: 'Type is required' }),
    })),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
    name: '',
    country: '',
    city: '',
    contactNumber: '',
    yearlyAmount: [{
        date: '',
        amount: 0,
        type: 'Zakat',
    }],
};

export function AddDonorForm(): React.JSX.Element {
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
            const response = await fetch(`${envConfig.url}/donors/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Donor Registration failed');
            }

            setSuccessMessage('Donor added successfully!');

            // Redirect after a short delay to show the success message
            setTimeout(() => {
            router.push('/dashboard/donors');
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
            <Typography variant="h4">Add New Donor</Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>

            <Typography variant="h5">Personal Information</Typography>
            <Divider />

            <Controller
                control={control}
                name="name"
                render={({ field }) => (
                <FormControl error={Boolean(errors.name)}>
                    <InputLabel>Name</InputLabel>
                    <OutlinedInput {...field} label="Name" />
                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                </FormControl>
                )}
            />
            
            <Controller
                control={control}
                name="country"
                render={({ field }) => (
                <FormControl error={Boolean(errors.country)}>
                    <InputLabel>Country</InputLabel>
                    <OutlinedInput {...field} label="Country" />
                    {errors.country ? <FormHelperText>{errors.country.message}</FormHelperText> : null}
                </FormControl>
                )}
            />

            <Controller
                control={control}
                name="city"
                render={({ field }) => (
                <FormControl error={Boolean(errors.city)}>
                    <InputLabel>City</InputLabel>
                    <OutlinedInput {...field} label="City" />
                    {errors.city ? <FormHelperText>{errors.city.message}</FormHelperText> : null}
                </FormControl>
                )}
            />

            <Controller
                control={control}
                name="contactNumber"
                render={({ field }) => (
                <FormControl error={Boolean(errors.contactNumber)}>
                    <InputLabel>Contact Number</InputLabel>
                    <OutlinedInput {...field} label="Contact Number" />
                    {errors.contactNumber ? <FormHelperText>{errors.contactNumber.message}</FormHelperText> : null}
                </FormControl>
                )}
            />

            <br />
            <Typography variant="h5">Yearly Donation Information</Typography>
            <Divider />

            <Controller
                control={control}
                name="yearlyAmount[0].date"
                render={({ field }) => (
                <FormControl error={Boolean(errors.yearlyAmount?.[0]?.date)}>
                    <InputLabel>Date</InputLabel>
                    <OutlinedInput {...field} label="Date" type="date" />
                    {errors.yearlyAmount?.[0]?.date ? <FormHelperText>{errors.yearlyAmount[0].date.message}</FormHelperText> : null}
                </FormControl>
                )}
            />
            
            <Controller
                control={control}
                name="yearlyAmount[0].amount"
                render={({ field }) => (
                <FormControl error={Boolean(errors.yearlyAmount?.[0]?.amount)}>
                    <InputLabel>Amount</InputLabel>
                    <OutlinedInput {...field} label="Amount" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                    {errors.yearlyAmount?.[0]?.amount ? <FormHelperText>{errors.yearlyAmount[0].amount.message}</FormHelperText> : null}
                </FormControl>
                )}
            />
            
            <Controller
                control={control}
                name="yearlyAmount[0].type"
                render={({ field }) => (
                <FormControl error={Boolean(errors.yearlyAmount?.[0]?.type)}>
                    <InputLabel>Type</InputLabel>
                    <Select {...field} label="Type">
                    <MenuItem value="Zakat">Zakat</MenuItem>
                    <MenuItem value="Sadqah">Sadqah</MenuItem>
                    <MenuItem value="Fitra">Fitra</MenuItem>
                    <MenuItem value="Kherat">Kherat</MenuItem>
                    </Select>
                    {errors.yearlyAmount?.[0]?.type ? <FormHelperText>{errors.yearlyAmount[0].type.message}</FormHelperText> : null}
                </FormControl>
                )}
            />

            <br />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
                Add Donor
            </Button>
            </Stack>
        </form>
        </Stack>
    );
}
