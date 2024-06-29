import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface ExtraExpensesFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function ExtraExpensesFilters({ searchQuery, setSearchQuery }: ExtraExpensesFiltersProps): React.JSX.Element {
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Card sx={{ p: 2 }}>
            <OutlinedInput
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                placeholder="Search extra expenses"
                startAdornment={
                    <InputAdornment position="start">
                        <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                    </InputAdornment>
                }
                sx={{ maxWidth: '500px' }}
            />
        </Card>
    );
}
