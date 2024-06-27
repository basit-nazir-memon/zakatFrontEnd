import * as React from 'react';
import ClientComponent from './ClientComponent';
import { config } from '@/config';


const Page = ({ params }) => {
    const { month, year } = params;
    return <ClientComponent year={year} month={month}/>;
};

export const metadata = { title: `Expense History Details | Dashboard | ${config.site.name}` };

export default Page;
