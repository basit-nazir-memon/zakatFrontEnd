import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpForm } from '@/components/dashboard/register/sign-up-form';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AddDonorForm } from '@/components/dashboard/donors/add-donor-page';


export const metadata = { title: `Add Donor | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <AuthGuard>
        <AddDonorForm />
      </AuthGuard>
  );
}
