import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface UsersFiltersProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function UsersFilters({ searchQuery, setSearchQuery }: UsersFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        placeholder="Search user"
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
