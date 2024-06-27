"use client";

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { Sales } from '@/components/dashboard/overview/sales';
import { USDInfoCard } from '@/components/dashboard/overview/USDInfoCard';
import { PKRInfoCard } from '@/components/dashboard/overview/PKRInfoCard';
import { CurrentMonthInfoCard } from '@/components/dashboard/overview/CurrMonthInfoCard';
import { NextMonthInfoCard } from '@/components/dashboard/overview/NextMonthInfoCard';
import { envConfig } from '../../../env';


export default function Page(): React.JSX.Element {
  const [summaryData, setSummaryData] = React.useState({
    totalAmountUSD: 0,
    totalAmountPKR: 0,
    currentMonthTotalExpenses: 0,
    sumExpense: 0,
    expenseHistory: []
  });

  const [pending, setPending] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
        const token : string | null = localStorage.getItem('auth-token')
    try {
        const response = await fetch(`${envConfig.url}/summary`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        if (!response.ok) {
        throw new Error('Failed to fetch the details');
        }
        const data = await response.json();
        setSummaryData(data);

        setPending(false);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    };
  
    fetchData();
  }, []);


  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <USDInfoCard value={summaryData?.totalAmountUSD} isPending={pending}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <PKRInfoCard value={summaryData?.totalAmountPKR} isPending={pending} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <CurrentMonthInfoCard value={`${summaryData.currentMonthTotalExpenses}`} isPending={pending}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <NextMonthInfoCard value={`${summaryData.sumExpense}`} isPending={pending} />
      </Grid>
      <Grid lg={12} xs={12}>
        <Sales
          chartSeries={summaryData.expenseHistory}
          sx={{ height: '100%' }}
          title='Monthly Expense Chart'
        />
      </Grid>
      {/* <Grid lg={4} md={6} xs={12}>
        <Traffic title='City Wise Expense Distribution' chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid> */}
      {/* <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              customer: { name: 'Cao Yu' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              customer: { name: 'Alexa Richardson' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              customer: { name: 'Anje Keizer' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              customer: { name: 'Clarke Gillebert' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              customer: { name: 'Adam Denisov' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
    </Grid>
  );
}
