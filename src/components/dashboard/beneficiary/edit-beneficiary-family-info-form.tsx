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
    familyInfo: zod.object({
        son: zod.number().optional(),
        daughter: zod.number().optional(),
        adopted: zod.number().optional(),
    }),
});

type Values = zod.infer<typeof schema>;


const defaultValues = {
    familyInfo: {
        son: 0,
        daughter: 0,
        adopted: 0
    },
} satisfies Values;

export function EditBeneficiaryFamilyInfoForm({ id, familyInfo }): React.JSX.Element {
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
            setValue('familyInfo', familyInfo);
        };

        update();
    }, [familyInfo]);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            const token = localStorage.getItem('auth-token');
            try{
                const response = await fetch(`${envConfig.url}/beneficiaries/familyInfo/${id}`, {
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
        
                setSuccessMessage('Family Information updated successfully!');
        
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
            <Grid item lg={12} md={12} xs={12}>
                <Card>
                    <CardHeader title={<Typography variant="h5">Family Information</Typography>} />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={12} >
                                <Controller
                                    control={control}
                                    name="familyInfo.son"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors.familyInfo?.son)}>
                                        <InputLabel>Number of Sons</InputLabel>
                                        <OutlinedInput {...field} label="Number of Sons" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        {errors.familyInfo?.son ? <FormHelperText>{errors.familyInfo.son.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Controller
                                    control={control}
                                    name="familyInfo.daughter"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors.familyInfo?.daughter)}>
                                        <InputLabel>Number of Daughters</InputLabel>
                                        <OutlinedInput {...field} label="Number of Daughters" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                        {errors.familyInfo?.daughter ? <FormHelperText>{errors.familyInfo.daughter.message}</FormHelperText> : null}
                                    </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Controller
                                    control={control}
                                    name="familyInfo.adopted"
                                    render={({ field }) => (
                                    <FormControl fullWidth error={Boolean(errors.familyInfo?.adopted)}>
                                        <InputLabel>Number of Adopted Children</InputLabel>
                                        <OutlinedInput {...field} label="Number of Adopted Children" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                        {errors.familyInfo?.adopted ? <FormHelperText>{errors.familyInfo.adopted.message}</FormHelperText> : null}
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
                            Save Family Information
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            </form>
        </Stack>
    );
}
