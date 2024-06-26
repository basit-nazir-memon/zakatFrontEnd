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
    isAlive: zod.boolean().optional(),
    deathDate: zod.string().optional(),
    profession: zod.string().min(1, { message: 'Profession is required' }),
    modeOfPayment: zod.enum(['Cash', 'Online', 'Person']),
    bank: zod.string().optional(),
    accountNumber: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;


const defaultValues = {
    isAlive: true,
    deathDate: '',
    profession: '',
    modeOfPayment: 'Cash',
    bank: '',
    accountNumber: ''
} satisfies Values;

export function EditBeneficiaryAdditionalInfoForm({ id, isAlive, deathDate, profession, modeOfPayment, bank, accountNumber }): React.JSX.Element {
    const router = useRouter();

    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [showAliveField, setShowAliveField] = React.useState(defaultValues.isAlive);

    const {
        control,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const aliveChange = watch("isAlive");

    React.useEffect(() => {
        if (aliveChange == true) {
            setShowAliveField(false);
        } else {
            setShowAliveField(true);
        }
    }, [aliveChange]);
    

    React.useEffect(() => {

        const update = async () => {
            setValue('isAlive', isAlive);
            setValue('deathDate', deathDate ? new Date(deathDate).toISOString().split('T')[0] : '');
            setValue('profession', profession);
            setValue('modeOfPayment', modeOfPayment);
            setValue('bank', bank);
            setValue('accountNumber', accountNumber);
        };

        update();
    }, [isAlive, deathDate, profession, modeOfPayment, bank, accountNumber]);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            const token = localStorage.getItem('auth-token');
            try{
                const response = await fetch(`${envConfig.url}/beneficiaries/additionalInfo/${id}`, {
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
        
                setSuccessMessage('Additional Information updated successfully!');
        
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
                    <CardHeader title={<Typography variant="h5">Additional Information</Typography>} />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="profession"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.profession)}>
                                    <InputLabel>Profession</InputLabel>
                                    <OutlinedInput {...field} label="Profession" />
                                    {errors.profession ? <FormHelperText>{errors.profession.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="modeOfPayment"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors?.modeOfPayment)}>
                                    <InputLabel>Mode Of Payment</InputLabel>
                                    <Select {...field} label="Mode Of Payment">
                                    <MenuItem value="Cash">Cash</MenuItem>
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Person">Person</MenuItem>
                                    </Select>
                                    {errors.modeOfPayment ? <FormHelperText>{errors.modeOfPayment.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                            </Grid>
                            
                            <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="bank"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.bank)}>
                                    <InputLabel>Bank</InputLabel>
                                    <OutlinedInput {...field} label="Bank" />
                                    {errors.bank ? <FormHelperText>{errors.bank.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="accountNumber"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.accountNumber)}>
                                    <InputLabel>Account Number</InputLabel>
                                    <OutlinedInput {...field} label="Account Number" />
                                    {errors.accountNumber ? <FormHelperText>{errors.accountNumber.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                            <Controller
                                control={control}
                                name="isAlive"
                                render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors?.isAlive)}>
                                    <InputLabel>Alive</InputLabel>
                                    <Select {...field} label="Alive">
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                    </Select>
                                    {errors.isAlive ? <FormHelperText>{errors.isAlive.message}</FormHelperText> : null}
                                </FormControl>
                                )}
                            />
                            </Grid>

                            {
                                showAliveField ? (
                                    <Grid item lg={6} md={6} xs={12}>
                                    <Controller
                                        control={control}
                                        name="deathDate"
                                        render={({ field }) => (
                                        <FormControl fullWidth error={Boolean(errors?.deathDate)}>
                                            <InputLabel>Death Date</InputLabel>
                                            <OutlinedInput {...field} label="Profession" type='date' />
                                            {errors.deathDate ? <FormHelperText>{errors.deathDate.message}</FormHelperText> : null}
                                        </FormControl>
                                        )}
                                    />
                                    </Grid>
                                ) : ''
                            }
                        </Grid>
                        </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', margin: '10px' }}>
                        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                        {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
                        <Button disabled={isPending} type="submit" variant="contained">
                            Save Additional Information
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            </form>
        </Stack>
    );
}
