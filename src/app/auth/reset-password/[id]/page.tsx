import type { Metadata } from 'next';
import { config } from '@/config';
export const metadata = { title: `Create New password | Auth | ${config.site.name}` } satisfies Metadata;
export { default } from './CreateNewPasswordPage';