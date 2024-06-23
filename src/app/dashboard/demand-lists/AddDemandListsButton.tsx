'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react';

export function AddDemandListButton(): React.JSX.Element {
    const router = useRouter();

    const handleAddUserClick = () => {
        router.push('/dashboard/demand-lists/add');
    };

    return (
        <Button
        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        onClick={handleAddUserClick}
        >
            Add
        </Button>
    );
}
