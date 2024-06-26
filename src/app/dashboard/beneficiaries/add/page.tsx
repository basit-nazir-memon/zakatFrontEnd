import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpForm } from '@/components/dashboard/register/sign-up-form';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AddBeneficiaryForm } from '@/components/dashboard/beneficiary/add-beneficiary-form';
import { AdminGuard } from '@/components/auth/admin-guard';


export const metadata = { title: `Add Beneficiary | Beneficiaries | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <AuthGuard>
        <AdminGuard>
          < AddBeneficiaryForm/>
        </AdminGuard>
      </AuthGuard>
  );
}
