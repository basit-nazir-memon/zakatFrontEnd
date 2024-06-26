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
    gender: zod.enum(['Male', 'Female']),
    name: zod.string().min(1, { message: 'Name is required' }),
    CNIC: zod.string().optional(),
    ContactNumber: zod.string().optional(),
    City: zod.string().min(1, { message: 'City is required' }),
    Area: zod.string().min(1, { message: 'Area is required' }),
});

type Values = zod.infer<typeof schema>;


const defaultValues = {
    gender: 'Male',
    name: ' ',
    CNIC: ' ',
    ContactNumber: ' ',
    City: ' ',
    Area: ' ',
} satisfies Values;

export function EditBeneficiaryPersonalInfoForm({ id, name, gender, contactNo, city, area, cnic }): React.JSX.Element {
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

    React.useEffect(() => {
        const update = async () => {
            setValue('gender', gender);
            setValue('name', name);
            setValue('CNIC', cnic);
            setValue('ContactNumber', contactNo);
            setValue('City', city);
            setValue('Area', area);
        };

        update();
    }, [gender, name, cnic, contactNo, city, area]);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            const token = localStorage.getItem('auth-token');
            try{
                const response = await fetch(`${envConfig.url}/beneficiaries/personalInfo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
                });
        
                const data = await response.json();
        
                if (!response.ok) {
                    throw new Error(data.msg || data.errors || 'Beneficiary Profile Updation failed');
                }
        
                setSuccessMessage('Personal Information updated successfully!');
        
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
            <Grid container lg={12} md={12} xs={12}>
                <Card>
                    <CardHeader title={<Typography variant="h5">Personal Information</Typography>} />
                    <Divider />
                    <CardContent>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.name)}>
                                    <InputLabel>Name</InputLabel>
                                    <OutlinedInput {...field} label="Name" />
                                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="CNIC"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.CNIC)}>
                                    <InputLabel>CNIC</InputLabel>
                                    <OutlinedInput {...field} label="CNIC" />
                                    {errors.CNIC ? <FormHelperText>{errors.CNIC.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="ContactNumber"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.ContactNumber)}>
                                    <InputLabel>Contact Number</InputLabel>
                                    <OutlinedInput {...field} label="Contact Number" />
                                    {errors.ContactNumber ? <FormHelperText>{errors.ContactNumber.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.gender)}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select {...field} label="Gender">
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                    {errors.gender ? <FormHelperText>{errors.gender.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="City"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.City)}>
                                    <InputLabel>City</InputLabel>
                                    <OutlinedInput {...field} label="City" />
                                    {errors.City ? <FormHelperText>{errors.City.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} xs={12}>
                        <Controller
                            control={control}
                            name="Area"
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.Area)}>
                                    <InputLabel>Area</InputLabel>
                                    <OutlinedInput {...field} label="Area" />
                                    {errors.Area ? <FormHelperText>{errors.Area.message}</FormHelperText> : null}
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
                            Save Personal Information
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            </form>
        </Stack>
    );
}
