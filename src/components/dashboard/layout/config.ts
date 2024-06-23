import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'beneficiaries', title: 'Beneficiaries', href: paths.dashboard.beneficiaries, icon: 'users' },
  { key: 'expenses', title: 'Expense Hisory', href: paths.dashboard.integrations, icon: 'expense' },
  { key: 'monthly-expenses', title: 'Monthly Expenses', href: paths.dashboard.monthlyExpenditures, icon: 'expense' },
  { key: 'extra-expenses', title: 'Extra Expenses', href: paths.dashboard.extraExpenditures, icon: 'expense' },
  { key: 'inflows', title: 'Cash Inflow & Conversion', href: paths.dashboard.addConversionHistory, icon: 'expense' },
  { key: 'donors', title: 'Donors', href: paths.dashboard.donors, icon: 'users' },
  { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
  { key: 'demand-list', title: 'Demand List', href: paths.dashboard.demandLists, icon: 'users' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
