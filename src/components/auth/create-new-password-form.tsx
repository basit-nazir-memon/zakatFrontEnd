'use client';

import * as React from 'react';
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
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  token: zod.string(),
  newPassword: zod.string().min(8, { message: 'Password must be at least 8 characters long' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password should have one lowercase letter, one uppercase letter, one special character, and one number',
  }),
  confirmPassword: zod.string().min(8, { message: 'Confirm Password must be at least 8 characters long' })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Values = zod.infer<typeof schema>;

const defaultValues = { token: '', newPassword: '', confirmPassword: '' } satisfies Values;

export function CreateNewPasswordForm({ id }): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      values.token = id; 

      setIsPending(true);

      const { error } = await authClient.createNewPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      setSuccessMessage("Your password has been successfully reset.");

      setIsPending(false);
    },
    [setError]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Create New Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.newPassword)}>
                <InputLabel>New Password</InputLabel>
                <OutlinedInput {...field} label="New Password" type="password" disabled={successMessage} />
                {errors.newPassword ? <FormHelperText>{errors.newPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput {...field} label="Confirm Password" type="password" disabled={successMessage} />
                {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          {successMessage ? <Alert color="success">{successMessage}</Alert> : null}
          
          {
            successMessage ?
              <div>
                <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
                  Back to Sign In Page
                </Link>
              </div> : 
              <Button disabled={isPending} type="submit" variant="contained">
                Create new password
              </Button>
          }
          
        </Stack>
      </form>
    </Stack>
  );
}
