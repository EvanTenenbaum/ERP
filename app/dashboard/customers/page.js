'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/ui/PageHeader';
import Table from '../../../components/ui/Table';
import Link from 'next/link';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample customers data
  const customersData = [
    { 
      id: 'CUST001', 
      name: 'Greenleaf Distributors', 
      contact: 'John Smith', 
      email: 'john@greenleaf.com', 
      phone: '(555) 123-4567', 
      location: 'Los Angeles, CA',
      status: 'Active',
      creditLimit: '$50,000',
      totalPurchases: '$124,500'
    },
    { 
      id: 'CUST002', 
      name: 'Herbal Solutions', 
      contact: 'Sarah Johnson', 
      email: 'sarah@herbalsolutions.com', 
      phone: '(555) 234-5678', 
      location: 'Denver, CO',
      status: 'Active',
      creditLimit: '$35,000',
      totalPurchases: '$87,200'
    },
    { 
      id: 'CUST003', 
      name: 'Natural Wellness', 
      contact: 'Michael Brown', 
      email: 'michael@naturalwellness.com', 
      phone: '(555) 345-6789', 
      location: 'Portland, OR',
      status: 'Active',
      creditLimit: '$25,000',
      totalPurchases: '$62,800'
    },
    { 
      id: 'CUST004', 
      name: 'Organic Remedies', 
      contact: 'Jessica Davis', 
      email: 'jessica@organicremedies.com', 
      phone: '(555) 456-7890', 
      location: 'Seattle, WA',
      status: 'Inactive',
      creditLimit: '$15,000',
      totalPurchases: '$8,500'
    },
    { 
      id: 'CUST005', 
      name: 'Pure Hemp Collective', 
      contact: 'David Wilson', 
      email: 'david@purehempcollective.com', 
      phone: '(555) 567-8901', 
      location: 'Austin, TX',
      status: 'Active',
      creditLimit: '$40,000',
      totalPurchases: '$95,300'
    },
  ];

  // Table columns
  const columns = [
    { id: 'id', label: 'Customer ID' },
    { id: 'name', label: 'Business Name' },
    { id: 'contact', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'location', label: 'Location' },
    { id: 'status', label: 'Status',
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Active' ? 'success' : 'default'} 
        />
      )
    },
    { id: 'creditLimit', label: 'Credit Limit', align: 'right' },
    { id: 'totalPurchases', label: 'Total Purchases', align: 'right' },
  ];

  // Filter data based on search query
  const filteredData = customersData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top customers for highlight section
  const topCustomers = [...customersData]
    .sort((a, b) => {
      const aValue = parseFloat(a.totalPurchases.replace(/[^0-9.-]+/g, ''));
      const bValue = parseFloat(b.totalPurchases.replace(/[^0-9.-]+/g, ''));
      return bValue - aValue;
    })
    .slice(0, 3);

  return (
    <Box>
      <PageHeader 
        title="Customer Management" 
        description="Manage your wholesale customers and their information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
        ]}
        actions={
          <Button 
            component={Link}
            href="/dashboard/customers/new"
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Add Customer
          </Button>
        }
      />
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {topCustomers.map((customer, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : 'success.main',
                    mr: 2
                  }}
                >
                  {customer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{customer.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{customer.id}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Purchases</Typography>
                  <Typography variant="h6">{customer.totalPurchases}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Credit Limit</Typography>
                  <Typography variant="h6">{customer.creditLimit}</Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  component={Link}
                  href={`/dashboard/customers/${customer.id}`}
                  variant="outlined" 
                  size="small"
                >
                  View Profile
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Card>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by name, contact, or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button variant="outlined">
                Export
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Table 
          columns={columns} 
          data={filteredData}
          pagination={true}
          rowsPerPage={10}
        />
      </Card>
    </Box>
  );
}
