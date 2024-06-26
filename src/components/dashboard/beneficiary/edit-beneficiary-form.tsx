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
import { useUser } from '@/hooks/use-user';
import { Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Stack } from '@mui/system';
import { envConfig } from '../../../../env';
import { EditBeneficiaryPersonalInfoForm } from './edit-beneficiary-personal-info-form';
import { EditBeneficiaryFamilyInfoForm } from './edit-beneficiary-family-info-form';
import { EditBeneficiaryAdditionalInfoForm } from './edit-beneficiary-additional-info-form';
import { EditBeneficiaryExtraFAInfoForm } from './edit-beneficiary-extraFA-info-form';
import { EditBeneficiaryTermInfoForm } from './edit-beneficiary-term-info-form';

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
    isClosed: zod.boolean().optional(),
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
  name: ' ',
  CNIC: ' ',
  ContactNumber: ' ',
  City: ' ',
  Area: ' ',
  Term: [
    {
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
  bank: ' ',
  accountNumber: ' '
} satisfies Values;

export function EditBeneficiaryForm({ id }): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const [beneficiary, setBeneficiary] = React.useState(null);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [showReasonField, setShowReasonField] = React.useState(false);


  const termType = watch("Term[0].type");




  React.useEffect(() => {
    if (termType === 'Occasionally') {
      setShowReasonField(true);
    } else {
      setShowReasonField(false);
    }
  }, [termType]);


  

  React.useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            setError('root', { type: 'server', message: "No auth token found"});
            return;
        }

        try {
            const response = await fetch(`${envConfig.url}/beneficiaries/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch beneficiary');
            }

            const data = await response.json();
            setBeneficiary(data);

             // Update form values with fetched data
            Object.keys(data).forEach(key => {
              setValue(key, data[key]);
            });

            console.log(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('root', { type: 'server', message: 'Failed to fetch profile' });
        }
    };

    fetchProfile();
  }, [id]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      try{
        const response = await fetch(`${envConfig.url}/beneficiaries/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
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
      
        <Stack spacing={3}>
          
          <EditBeneficiaryPersonalInfoForm id={id} name={beneficiary?.name} gender={beneficiary?.gender} contactNo={beneficiary?.ContactNumber} city={beneficiary?.City} area={beneficiary?.Area} cnic={beneficiary?.CNIC}/>

          <EditBeneficiaryFamilyInfoForm id={id} familyInfo={beneficiary?.familyInfo} />

          <EditBeneficiaryAdditionalInfoForm id={id} profession={beneficiary?.profession} isAlive={beneficiary?.isAlive} deathDate={beneficiary?.deathDate} modeOfPayment={beneficiary?.modeOfPayment} bank={beneficiary?.bank} accountNumber={beneficiary?.accountNumber} />

          <EditBeneficiaryExtraFAInfoForm id={id}/>

          <EditBeneficiaryTermInfoForm id={id} Term={beneficiary?.Term[beneficiary?.currentTerm - 1]}/>

        </Stack>
    </Stack>
  );
}
