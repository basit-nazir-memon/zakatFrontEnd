import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AddDemandListForm } from '@/components/dashboard/demandList/add-demand-list-page';


export const metadata = { title: `Add Demand List | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <AuthGuard>
        <AddDemandListForm />
      </AuthGuard>
  );
}
