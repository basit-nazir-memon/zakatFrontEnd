import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { AuthGuard } from '@/components/auth/auth-guard';
import { EditBeneficiaryForm } from '@/components/dashboard/beneficiary/edit-beneficiary-form';
import { AdminGuard } from '@/components/auth/admin-guard';


export const metadata = { title: `Edit Beneficiary | Beneficiaries | ${config.site.name}` } satisfies Metadata;

export default function Page({ params }): React.JSX.Element {
  const { id } = params;

  return (
      <AuthGuard>
        <AdminGuard>
          <EditBeneficiaryForm id={id}/>
        </AdminGuard>
      </AuthGuard>
  );
}
