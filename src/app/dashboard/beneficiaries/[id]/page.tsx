// /src/app/dashboard/beneficiaries/[id]/page.tsx
import * as React from 'react';
import ClientComponent from './ClientComponent';

const Page = ({ params }) => {
    const { id } = params;
    return <ClientComponent id={id} />;
};

export default Page;
