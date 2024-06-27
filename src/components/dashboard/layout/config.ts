import { paths } from '@/paths';


export const getNavItems = (role : string | undefined) => {
  const navItems = [
    { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
    { key: 'beneficiaries', title: 'Beneficiaries', href: paths.dashboard.beneficiaries, icon: 'beneficiary' },
    { key: 'expense-history', title: 'Expense History', href: paths.dashboard.expenseHistory, icon: 'history' },
    { key: 'monthly-expenses', title: 'Monthly Expenses', href: paths.dashboard.monthlyExpenditures, icon: 'monthly-expenses' },
    { key: 'extra-expenses', title: 'Extra Expenses', href: paths.dashboard.extraExpenditures, icon: 'extra' },
    { key: 'inflows', title: 'Cash Inflow & Conversion', href: paths.dashboard.addConversionHistory, icon: 'expense' },
    { key: 'donors', title: 'Donors', href: paths.dashboard.donors, icon: 'donors' },
    { key: 'demand-list', title: 'Demand List', href: paths.dashboard.demandLists, icon: 'demand' },
    { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
    { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  ];

  if (role === 'Admin') {
    navItems.splice(7, 0, { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' });
  }

  return navItems;
}