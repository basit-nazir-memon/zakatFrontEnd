import * as React from 'react';
import ClientComponent from './ClientComponent';
import { config } from '@/config';
import { EditorGuard } from '@/components/auth/editor-guard';


const Page = ({ params }) => {
    const { month, year } = params;
    return (
        <EditorGuard>
            <ClientComponent year={year} month={month}/>
        </EditorGuard>
    );
};

export const metadata = { title: `Expense History Details | Dashboard | ${config.site.name}` };

export default Page;
