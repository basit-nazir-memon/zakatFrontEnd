import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AddDonorForm } from '@/components/dashboard/donors/add-donor-page';
import { AdminGuard } from '@/components/auth/admin-guard';


export const metadata = { title: `Add Donor | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <AuthGuard>
        <AdminGuard>
          <AddDonorForm />
        </AdminGuard>
      </AuthGuard>
  );
}
