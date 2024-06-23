import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Container, Typography } from '@mui/material';

interface Beneficiary {
    _id: string;
    name: string;
    CNIC: string;
    gender: string;
    isAlive: boolean;
    City: string;
    Area: string;
}

const BeneficiaryDetail: React.FC = () => {
    const router = useRouter();
    
    const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     if (id) {
    //     // axios.get(`/api/beneficiaries/${id}`)
    //     //     .then(response => {
    //     //     setBeneficiary(response.data);
    //     //     setLoading(false);
    //     //     })
    //     //     .catch(err => {
    //     //     setError('Error loading beneficiary details');
    //     //     setLoading(false);
    //     //     });
    //     // }
    // }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    if (!beneficiary) {
        return <Typography variant="h6">No beneficiary found</Typography>;
    }

    return (
        <Container>
        <Typography variant="h4">{beneficiary.name}</Typography>
        <Typography variant="body1">CNIC: {beneficiary.CNIC}</Typography>
        <Typography variant="body1">Gender: {beneficiary.gender}</Typography>
        <Typography variant="body1">City: {beneficiary.City}</Typography>
        <Typography variant="body1">Area: {beneficiary.Area}</Typography>
        <Typography variant="body1">Status: {beneficiary.isAlive ? 'Alive' : 'Deceased'}</Typography>
        {/* Add more fields as needed */}
        </Container>
    );
};

export default BeneficiaryDetail;
