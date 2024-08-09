'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { Pen, Plus as PlusIcon } from '@phosphor-icons/react';
import { Eye } from '@phosphor-icons/react/dist/ssr';


interface MonthlyExpenditureButtonProps {
    id: string;
}


export function MonthlyExpenditurePaymentButton({ id }: MonthlyExpenditureButtonProps): React.JSX.Element {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/beneficiaries/edit/${id}`);
    };

    return (
        <Button
            startIcon={<Pen fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleClick}
            >
                Edit
        </Button>
    );
}
