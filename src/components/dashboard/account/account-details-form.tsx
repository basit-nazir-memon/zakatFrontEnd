import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { envConfig } from '../../../../env';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  gender?: string;
  phone?: string;
  city?: string;
  country?: string;
}

interface AccountInfoProps {
  profile: Profile | null;
}

export function AccountDetailsForm({ profile }: AccountInfoProps): React.JSX.Element {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${envConfig.url}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage('Profile updated successfully.');
        setErrorMessage(null);
      } else {
        throw new Error('Failed to update profile.');
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <CircularProgress />;
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput defaultValue={profile?.firstName || ''} label="First name" name="firstName" />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required >
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput defaultValue={profile?.lastName || ''} label="Last name" name="lastName" />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput defaultValue={profile?.email || ''} label="Email address" name="email" />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth >
                  <InputLabel>Phone number</InputLabel>
                  <OutlinedInput
                    defaultValue={profile?.phone || ''}
                    label="Phone number"
                    name="phone"
                    type="tel"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>City</InputLabel>
                  <OutlinedInput defaultValue={profile?.city || ''} label="City" name="city" />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Country</InputLabel>
                  <OutlinedInput defaultValue={profile?.country || ''} label="Country" name="country" />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select defaultValue={profile?.gender || ''} label="Gender" name="gender" variant="outlined">
                    <MenuItem key={1} value="Male">
                      Male
                    </MenuItem>
                    <MenuItem key={2} value="Female">
                      Female
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', padding: '16px' }}>
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save details'}
            </Button>
          </CardActions>
        </Card>
      </form>

      {successMessage && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
          <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {errorMessage && (
        <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
          <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
