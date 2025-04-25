'use client';
import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Container, Grid, Card as MuiCard, CardContent } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
        <Toolbar>
          <IconButton 
            component={Link} 
            href="/" 
            color="inherit" 
            edge="start" 
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hemp ERP
          </Typography>
          <Button 
            component={Link} 
            href="/dashboard" 
            color="inherit"
            sx={{ mx: 1 }}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            href="/dashboard/inventory" 
            color="inherit"
            sx={{ mx: 1 }}
          >
            Inventory
          </Button>
          <Button 
            component={Link} 
            href="/dashboard/customers" 
            color="inherit"
            sx={{ mx: 1 }}
          >
            Customers
          </Button>
          <Button 
            component={Link} 
            href="/dashboard/sales" 
            color="inherit"
            sx={{ mx: 1 }}
          >
            Sales
          </Button>
        </Toolbar>
      </AppBar>
      
      <main className="flex-grow">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Multi-Tenant ERP System
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              A comprehensive solution for hemp flower wholesale brokerage businesses
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <MuiCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <InventoryIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Inventory Management
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Track inventory across multiple locations with product images and detailed information.
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/dashboard/inventory" 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Explore Inventory
                  </Button>
                </CardContent>
              </MuiCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <MuiCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Customer Management
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Manage customer information, track sales history, and monitor payment patterns.
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/dashboard/customers" 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                  >
                    View Customers
                  </Button>
                </CardContent>
              </MuiCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <MuiCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <AssessmentIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Sales & Reporting
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Create invoices, manage sales, and generate comprehensive reports.
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/dashboard/reports" 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                  >
                    View Reports
                  </Button>
                </CardContent>
              </MuiCard>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              component={Link} 
              href="/dashboard" 
              variant="outlined" 
              color="primary" 
              size="large"
              startIcon={<DashboardIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Container>
      </main>
      
      <footer className="bg-white shadow-sm dark:bg-gray-800 mt-auto">
        <Container maxWidth="lg">
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Hemp ERP. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
}
