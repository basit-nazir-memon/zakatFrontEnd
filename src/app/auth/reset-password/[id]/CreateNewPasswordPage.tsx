"use client";

import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { CreateNewPasswordForm } from '@/components/auth/create-new-password-form';

export default function Page({params}): React.JSX.Element {
  const { id } = params;
  return (
    <Layout>
      <GuestGuard>
        <CreateNewPasswordForm id={id}/>
      </GuestGuard>
    </Layout>
  );
}
