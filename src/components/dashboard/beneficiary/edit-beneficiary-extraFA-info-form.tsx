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
import { Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel } from '@mui/material';
import { Stack, prepareCssVars } from '@mui/system';
import { envConfig } from '../../../../env';
import CircularProgress from '@mui/material/CircularProgress';

const schema = zod.object({
    extraFA: zod.object({
        reason: zod.string().min(1, { message: 'Reason is required' }),
        amount: zod.number().min(1, { message: 'Amount is required' }),
        date: zod.string().min(1, { message: 'Date is required' }),
        picProof: zod.array(zod.string()).optional(),
    }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
    extraFA: {
        reason: '',
        amount: 0,
        date: '',
        picProof: []
    },
} satisfies Values;

export function EditBeneficiaryExtraFAInfoForm({ id }): React.JSX.Element {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [showField, setShowField] = React.useState(false);
    const [uploadedImages, setUploadedImages] = React.useState([]);
    const [uploadingImages, setUploadingImages] = React.useState({});

    const {
        control,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    // const handleImageUpload = async (event) => {
    //     const files = event.target.files;
    //     const newImages = [...uploadedImages];
    //     const newUploadingImages = { ...uploadingImages };
    //     setIsPending(true);

    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         newImages.push(URL.createObjectURL(file));
    //         newUploadingImages[file.name] = true;

    //         const formData = new FormData();
    //         formData.append('avatar', file);

    //         try {
    //             const response = await fetch(`${envConfig.url}/upload-avatar`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    //                 },
    //                 body: formData,
    //             });

    //             const data = await response.json();

    //             if (!response.ok) {
    //                 throw new Error(data.error || 'Failed to upload image');
    //             }

    //             // Replace the local URL with the uploaded image URL
    //             const imageIndex = newImages.findIndex((img) => img === URL.createObjectURL(file));
    //             newImages[imageIndex] = data.imageUrl;
    //             newUploadingImages[file.name] = false;

    //             setUploadedImages([...newImages]);
    //             setUploadingImages({ ...newUploadingImages });
                
    //         } catch (error) {
    //             console.error('Error uploading image:', error.message);
    //             newUploadingImages[file.name] = false;
    //             setUploadingImages({ ...newUploadingImages });
    //         }
    //     }

    //     setIsPending(false);
    // };

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        setIsPending(true);
    
        try {
            const promises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('avatar', file);
                const response = await fetch(`${envConfig.url}/upload-avatar`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                    },
                    body: formData,
                });
    
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to upload image');
                }
    
                const data = await response.json();

                const prevImages = uploadedImages;
                prevImages.push(data.avatar);

                setUploadedImages(prevImages);

                return data.avatar;
            });
    
            const urls = await Promise.all(promises);
            setIsPending(false);
        } catch (error) {
            console.error('Error uploading images:', error.message);
            setIsPending(false);
        }
    };

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);
            const token = localStorage.getItem('auth-token');
            values.extraFA.picProof = uploadedImages;

            try {
                const response = await fetch(`${envConfig.url}/beneficiaries/extraFA/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || data.error || 'Extra FA Addition failed');
                }

                setSuccessMessage('Extra Financial Assistance Record Added successfully!');


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
                        <CardHeader title={
                            <Stack direction="row">
                                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                                    <Typography variant="h5">Add Financial Assistance Record</Typography>
                                </Stack>
                                <div>
                                    <Button variant='outlined' disabled={isPending} onClick={() => setShowField(!showField)}>{showField ? "Remove FA" : "Add FA"}</Button>
                                </div>
                            </Stack>
                        } />
                        <Divider />

                        {
                            showField ? (
                                <>
                                    <CardContent>

                                        <Grid container spacing={2}>
                                            <Grid item lg={6} md={6} xs={12}>
                                                <Controller
                                                    control={control}
                                                    name="extraFA.reason"
                                                    render={({ field }) => (
                                                        <FormControl fullWidth error={Boolean(errors.extraFA?.reason)}>
                                                            <InputLabel>Reason</InputLabel>
                                                            <OutlinedInput {...field} label="Reason" />
                                                            {errors.extraFA?.reason ? <FormHelperText>{errors.extraFA.reason.message}</FormHelperText> : null}
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} xs={12}>
                                                <Controller
                                                    control={control}
                                                    name="extraFA.amount"
                                                    render={({ field }) => (
                                                        <FormControl fullWidth error={Boolean(errors.extraFA?.amount)}>
                                                            <InputLabel>Amount</InputLabel>
                                                            <OutlinedInput {...field} label="Amount" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                                            {errors.extraFA?.amount ? <FormHelperText>{errors.extraFA.amount.message}</FormHelperText> : null}
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} xs={12}>
                                                <Controller
                                                    control={control}
                                                    name="extraFA.date"
                                                    render={({ field }) => (
                                                        <FormControl fullWidth error={Boolean(errors.extraFA?.date)}>
                                                            <InputLabel>Extra FA Date</InputLabel>
                                                            <OutlinedInput {...field} label="Extra FA Date" type="date" />
                                                            {errors.extraFA?.date ? <FormHelperText>{errors.extraFA.date.message}</FormHelperText> : null}
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} xs={12}>
                                                <Controller
                                                    control={control}
                                                    name="extraFA.picProof"
                                                    render={({ field }) => (
                                                        <FormControl fullWidth error={Boolean(errors.extraFA?.picProof)}>
                                                            <Button variant="contained" component="label" disabled={isPending}>
                                                                Upload Picture Proof
                                                                <input
                                                                    type="file"
                                                                    hidden
                                                                    multiple
                                                                    onChange={handleImageUpload}
                                                                />
                                                            </Button>
                                                            {errors.extraFA?.picProof ? (
                                                                <FormHelperText>{errors.extraFA.picProof.message}</FormHelperText>
                                                            ) : null}
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item lg={12} md={12} xs={12}>
                                            <Stack direction="row" spacing={2}>
                                                    {uploadedImages.map((imageUrl, index) => (
                                                        <div key={index} style={{ position: 'relative' }}>
                                                            <img src={imageUrl} alt={`proof-${index}`} width={100} height={100} />
                                                        </div>
                                                    ))}
                                                </Stack>
                                                {/* <Stack direction="row" spacing={2}>
                                                    {uploadedImages.map((image, index) => (
                                                        <div key={index} style={{ position: 'relative' }}>
                                                            {uploadingImages[image.name] ? (
                                                                <CircularProgress
                                                                    size={48}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform: 'translate(-50%, -50%)',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img src={image} alt={`proof-${index}`} width={100} height={100} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </Stack> */}
                                            </Grid>
                                        </Grid>

                                    </CardContent>
                                    <Divider />
                                    <CardActions sx={{ justifyContent: 'flex-end', margin: '10px' }}>
                                        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                                        {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
                                        <Button disabled={isPending} type="submit" variant="contained">
                                            Save FA Record
                                        </Button>
                                    </CardActions>
                                </>
                            ) : ''
                        }
                    </Card>
                </Grid>
            </form>
        </Stack>
    );
}
