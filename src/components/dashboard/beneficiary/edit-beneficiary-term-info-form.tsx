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
import { EditBeneficiaryAmountTermForm } from './edit-beneficiary-term-amountChange-form';
import { AddBeneficiaryTermForm } from './Add-beneficiary-term-form';

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
                reason: ' ',
                amountChange: 0,
                date: ''
            }
        ],
        closureReason: ' ',
        startDate: '',
        endDate: '',
        isClosed: false,
    }
} satisfies Values;

export function EditBeneficiaryTermInfoForm({ id, Term }): React.JSX.Element {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [showAddNewTermField, setShowAddNewTermField] = React.useState(false);
    const [showAddNewAmountTermField, setShowAddNewAmountTermField] = React.useState(false);
    const [isClosed, setIsClosed] = React.useState(false);


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
            setValue('Term', Term);
        };

        update();

        setIsClosed(Term?.isClosed);

    }, [Term]);

    const closeTerm = async () => {
        setShowAddNewAmountTermField(false);
        setShowAddNewTermField(false);

        const token = localStorage.getItem('auth-token');

        try {
            const response = await fetch(`${envConfig.url}/beneficiaries/term/close/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || data.error || 'Term Closure failed');
            }

            setSuccessMessage('Term Closed successfully!');
            // defaultValues.Term.isClosed = true;

        } catch (error) {
            setError('root', { type: 'server', message: error?.message });
            setIsPending(false);
        }
    }

    const removeNewTerm = () => {
        setShowAddNewTermField(!showAddNewTermField);
        setShowAddNewAmountTermField(false);
    }

    const removeNewAmountTerm = () => {
        setShowAddNewAmountTermField(!showAddNewAmountTermField);
        setShowAddNewTermField(false);
    }

    return (
        <Stack spacing={3}>
                <Grid item lg={12} md={12} xs={12}>
                    <Card>
                        <CardHeader title={
                            <Stack direction="row">
                                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                                    <Typography variant="h5">Terms Information Record</Typography>
                                </Stack>
                                {
                                isClosed ?
                                    <div style={{margin: "0 3px"}}>
                                        <Button variant='outlined' disabled={isPending} onClick={removeNewTerm}>{showAddNewTermField ? "Remove New Term" : "Add New Term"}</Button>
                                    </div>
                                    :
                                    <>
                                        <div style={{margin: "0 3px"}}>
                                            <Button variant='outlined' disabled={isPending} onClick={closeTerm}>Close this Term</Button>
                                        </div>
                                        <div style={{margin: "0 3px"}}>
                                            <Button variant='outlined' disabled={isPending} onClick={removeNewAmountTerm}>{showAddNewAmountTermField ? "Remove New Amount Term" : "Add New Amount Term"}</Button>
                                        </div>
                                    </>
                                }
                            </Stack>
                        } />
                        <Divider />

                        {
                            showAddNewTermField ? (
                                <AddBeneficiaryTermForm id={id}/>
                            ) : ''
                        }

                        {
                            showAddNewAmountTermField ? (
                                <EditBeneficiaryAmountTermForm id={id} />
                            ) : ''
                        }
                    </Card>
                </Grid>
        </Stack>
    );
}
