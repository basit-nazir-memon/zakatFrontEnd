import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Money as MoneyIcon } from '@phosphor-icons/react/dist/ssr/Money';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { CircularProgress } from '@mui/material';

export interface Props {
  value: string;
  isPending: boolean;
}

export function CurrentMonthInfoCard({ value, isPending }: Props): React.JSX.Element {

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Curr Month Total
              </Typography>
              {isPending ? (
                <CircularProgress />
              ) : (
              <Typography variant="h4">{value}</Typography>
              )}
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <MoneyIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
