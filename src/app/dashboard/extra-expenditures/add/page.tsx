import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AddExpenditureForm } from '@/components/dashboard/extraExpenditure/add-extra-expenditure-page';
import { AdminGuard } from '@/components/auth/admin-guard';


export const metadata = { title: `Add Extra Expenses | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <AuthGuard>
        <AdminGuard>
          <AddExpenditureForm />
        </AdminGuard>
      </AuthGuard>
  );
}
