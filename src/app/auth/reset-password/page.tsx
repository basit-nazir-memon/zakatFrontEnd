import type { Metadata } from 'next';
import { config } from '@/config';
export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;
export { default } from './ResetPage';