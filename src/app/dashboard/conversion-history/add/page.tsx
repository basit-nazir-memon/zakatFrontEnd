import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AddConversionForm } from '@/components/dashboard/conversionHistory/add-conversion-history-page';


export const metadata = { title: `Add Conversion History | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <AuthGuard>
        <AddConversionForm />
      </AuthGuard>
  );
}
