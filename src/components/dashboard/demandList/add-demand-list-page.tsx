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
import { envConfig } from '../../../../env';
import { MenuItem, Select } from '@mui/material';

const schema = zod.object({
    Need: zod.number().min(1, { message: 'Need must be a positive number' }),
    Reason: zod.string().min(1, { message: 'Reason is required' }),
    isApproved: zod.boolean().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
    Need: 0,
    Reason: '',
    isApproved: false,
};

export function AddDemandListForm(): React.JSX.Element {
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
                const response = await fetch(`${envConfig.url}/demand-lists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Adding Demand List failed');
                }

                setSuccessMessage('Demand List added successfully!');

                // Redirect after a short delay to show the success message
                setTimeout(() => {
                    router.push('/dashboard/demand-lists');
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
                <Typography variant="h4">Add New Demand List</Typography>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>


                    <Controller
                        control={control}
                        name="Need"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.Need)}>
                                <InputLabel>Need</InputLabel>
                                <OutlinedInput 
                                    {...field} 
                                    label="Need" 
                                    type='number' 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                {errors.Need ? <FormHelperText>{errors.Need.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Controller
                        control={control}
                        name="Reason"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.Reason)}>
                                <InputLabel>Reason</InputLabel>
                                <OutlinedInput {...field} label="Reason" />
                                {errors.Reason ? <FormHelperText>{errors.Reason.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Controller
                        control={control}
                        name="isApproved"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.isApproved)}>
                                <InputLabel>Approved</InputLabel>
                                <Select {...field} label="Approved">
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                                {errors.isApproved ? <FormHelperText>{errors.isApproved.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <br />
                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
                    <Button disabled={isPending} type="submit" variant="contained">
                        Add Demand List
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
