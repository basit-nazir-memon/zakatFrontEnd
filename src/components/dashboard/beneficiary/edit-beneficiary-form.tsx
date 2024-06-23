'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import SelectInput from '@mui/material/Select/SelectInput';
import { Card, CardActions, CardContent, CardHeader, Divider, Grid, MenuItem, Select } from '@mui/material';
import { envConfig } from '../../../../env';

const schema = zod.object({
  gender: zod.enum(['Male', 'Female']),
  name: zod.string().min(1, { message: 'Name is required' }),
  CNIC: zod.string().optional(),
  ContactNumber: zod.string().optional(),
  City: zod.string().min(1, { message: 'City is required' }),
  Area: zod.string().min(1, { message: 'Area is required' }),
  Term: zod.array(zod.object({
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
  })),
  currentTerm: zod.number().optional(),
  extraFA: zod.array(zod.object({
    reason: zod.string().optional(),
    amount: zod.number().optional(),
    date: zod.string().optional(),
    picProof: zod.array(zod.string()).optional(),
  })),
  isAlive: zod.boolean().optional(),
  deathDate: zod.string().optional(),
  familyInfo: zod.object({
    son: zod.number().optional(),
    daughter: zod.number().optional(),
    adopted: zod.number().optional(),
  }),
  profession: zod.string().min(1, { message: 'Profession is required' }),
  modeOfPayment: zod.enum(['Cash', 'Online', 'Person']),
  bank: zod.string().optional(),
  accountNumber: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;


const defaultValues = {
  gender: 'Male',
  name: '',
  CNIC: '',
  ContactNumber: '',
  City: '',
  Area: '',
  Term: [
    {
      status: "Poor",
      type: "Monthly",
      amountTerms: [
        {
          reason: '',
          amountChange: 0,
          date: ''
        }
      ],
      closureReason: '',
      startDate: '',
      endDate: ''
    }
  ],
  currentTerm: 1,
  extraFA: [
    {
      reason: '',
      amount: 0,
      date: '',
      picProof: []
    }
  ],
  isAlive: true,
  deathDate: '',
  familyInfo: {
    son: 0,
    daughter: 0,
    adopted: 0
  },
  profession: '',
  modeOfPayment: 'Cash',
  bank: '',
  accountNumber: ''
} satisfies Values;

export function EditBeneficiaryForm({ id }): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [showReasonField, setShowReasonField] = React.useState(false);

  const [showAliveField, setShowAliveField] = React.useState(defaultValues.isAlive);

  const termType = watch("Term[0].type");

  const aliveChange = watch("isAlive");


  React.useEffect(() => {
    if (termType === 'Occasionally') {
      setShowReasonField(true);
    } else {
      setShowReasonField(false);
    }
  }, [termType]);


  React.useEffect(() => {
    if (aliveChange == true) {
      setShowAliveField(false);
    } else {
      setShowAliveField(true);
    }
  }, [aliveChange]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      try{
        const response = await fetch(`${envConfig.url}/beneficiaries/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.msg || 'Beneficiary Registration failed');
        }
  
        setSuccessMessage('Beneficiary added successfully!');
  
        setTimeout(() => {
          router.push('/dashboard/beneficiaries');
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
        <Typography variant="h4">Edit Beneficiary</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
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
                  <Button variant="contained">Save Personal Information</Button>
                </CardActions>
            </Card>
          </Grid>



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
                  <Button variant="contained">Save Family Information</Button>
                </CardActions>
            </Card>
          </Grid>


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
                  <Button variant="contained">Save Additional Information</Button>
                </CardActions>
            </Card>
          </Grid>


          <Grid container lg={12} md={12} xs={12}>
            <Card>
                <CardHeader title={<Typography variant="h5">Payment Term Information</Typography>} />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end', margin: '10px' }}>
                  <Button variant="contained">Save Personal Information</Button>
                </CardActions>
            </Card>
          </Grid>


          <br/>
          <Typography variant="h5">Payment Term Information</Typography>
          <Divider/>

          <Controller
            control={control}
            name="Term[0].status"
            render={({ field }) => (
              <FormControl error={Boolean(errors.Term?.[0]?.status)}>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value="Widow">Widow</MenuItem>
                  <MenuItem value="Orphan">Orphan</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="Disabled">Disabled</MenuItem>
                  <MenuItem value="Patient">Patient</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </Select>
                {errors.Term?.[0]?.status ? <FormHelperText>{errors.Term[0].status.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="Term[0].type"
            render={({ field }) => (
              <FormControl error={Boolean(errors.Term?.[0]?.type)}>
                <InputLabel>Type</InputLabel>
                <Select {...field} label="Type">
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="Occasionally">Occasionally</MenuItem>
                </Select>
                {errors.Term?.[0]?.type ? <FormHelperText>{errors.Term[0].type.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="Term[0].amountTerms[0].reason"
            render={({ field }) => (
              <FormControl error={Boolean(errors.Term?.[0]?.amountTerms?.[0]?.reason)}>
                <InputLabel>Amount Reason</InputLabel>
                <OutlinedInput {...field} label="Amount Reason" />
                {errors.Term?.[0]?.amountTerms?.[0]?.reason ? <FormHelperText>{errors.Term[0].amountTerms[0].reason.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="Term[0].amountTerms[0].amountChange"
            render={({ field }) => (
              <FormControl error={Boolean(errors.Term?.[0]?.amountTerms?.[0]?.amountChange)}>
                <InputLabel>Amount (Monthly / Yearly)</InputLabel>
                <OutlinedInput {...field} label="Amount (Monthly / Yearly)" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                {errors.Term?.[0]?.amountTerms?.[0]?.amountChange ? <FormHelperText>{errors.Term[0].amountTerms[0].amountChange.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {
            showReasonField ? 
            <>
              <br/>
              <Typography variant="h5">Extra Financial Assistance</Typography>
              <Divider />

              <Controller
                control={control}
                name="extraFA[0].reason"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.extraFA?.[0]?.reason)}>
                    <InputLabel>Reason</InputLabel>
                    <OutlinedInput {...field} label="Reason" />
                    {errors.extraFA?.[0]?.reason ? <FormHelperText>{errors.extraFA[0].reason.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="extraFA[0].amount"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.extraFA?.[0]?.amount)}>
                    <InputLabel>Amount</InputLabel>
                    <OutlinedInput {...field} label="Amount" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                    {errors.extraFA?.[0]?.amount ? <FormHelperText>{errors.extraFA[0].amount.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="extraFA[0].date"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.extraFA?.[0]?.date)}>
                    <InputLabel>Extra FA Date</InputLabel>
                    <OutlinedInput {...field} label="Extra FA Date" type="date" />
                    {errors.extraFA?.[0]?.date ? <FormHelperText>{errors.extraFA[0].date.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="extraFA[0].picProof[0]"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.extraFA?.[0]?.picProof?.[0])}>
                    <InputLabel>Picture Proof</InputLabel>
                    <OutlinedInput {...field} label="Picture Proof" />
                    {errors.extraFA?.[0]?.picProof?.[0] ? (
                      <FormHelperText>{errors.extraFA[0].picProof[0].message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />

            </>
            : ""
          }

          <br/>
          <Typography variant="h5">Additional Information</Typography>
          <Divider />

         
          <br/>  
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Add Beneficiary
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
