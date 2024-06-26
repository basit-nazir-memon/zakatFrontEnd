'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { Eye } from '@phosphor-icons/react/dist/ssr';


interface BeneficiaryTableButtonProps {
    id: string;
}


export function BeneficiaryTableEditButton({ id }: BeneficiaryTableButtonProps): React.JSX.Element {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/beneficiaries/edit/${id}`);
    };

    return (
        <Button
            startIcon={<Eye fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleClick}
            >
                Edit
        </Button>
    );
}
