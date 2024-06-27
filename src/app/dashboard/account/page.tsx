"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { envConfig } from '../../../../env';

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

export default function Page(): React.JSX.Element {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError("No auth token found");
        return;
      }

      try {
        const response = await fetch(`${envConfig.url}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        data.city = data?.address?.city;
        data.country = data?.address?.country;
        setProfile(data);

      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid lg={4} md={6} xs={12}>
            <AccountInfo profile={profile} />
          </Grid>
          <Grid lg={8} md={6} xs={12}>
            <AccountDetailsForm profile={profile} />
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}