'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Alert, FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { envConfig } from '../../../../env';

const schema = zod.object({
  password: zod.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: zod.string().min(8, { message: 'Confirm password must be at least 8 characters' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  password: '',
  confirmPassword: '',
};

export function UpdatePasswordForm(): React.JSX.Element {
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    if (values.password !== values.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('auth-token');

    try {
      const response = await fetch(`${envConfig.url}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccessMessage('Password updated successfully');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" />
                  {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.confirmPassword)}>
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput {...field} label="Confirm Password" type="password" />
                  {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Stack>
          {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Update</Button>
        </CardActions>
      </Card>
    </form>
  );
}
