'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, Box, Paper, Container, Alert, Button } from '@mui/material';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unexpected authentication error occurred';

  // Map error codes to user-friendly messages
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid credentials. Please check your email, password, and tenant ID.';
  } else if (error === 'SessionRequired') {
    errorMessage = 'You must be signed in to access this page.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'You do not have permission to access this resource.';
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Authentication Error
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => router.push('/auth/login')}
            >
              Return to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
