'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { Eye } from '@phosphor-icons/react/dist/ssr';
import { Note } from '@phosphor-icons/react';


interface ExpenseHistoryTableButtonProps {
    month: string;
    year: string;
}


export function ExpenseHistoryTableButton({ month, year }: ExpenseHistoryTableButtonProps): React.JSX.Element {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/expense-history/${year}/${month}`);
    };

    return (
        <Button
            startIcon={<Note fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleClick}
            >
                Details
        </Button>
    );
}
