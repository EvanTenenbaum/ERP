'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/ui/PageHeader';
import Table from '../../../components/ui/Table';
import Link from 'next/link';

export default function SalesPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample sales data
  const salesData = [
    { 
      id: 'S001', 
      date: '2025-04-24', 
      customer: 'Greenleaf Distributors',
      customerId: 'CUST001',
      items: 3,
      total: '$4,500',
      status: 'Completed',
      paymentStatus: 'Paid'
    },
    { 
      id: 'S002', 
      date: '2025-04-23', 
      customer: 'Herbal Solutions',
      customerId: 'CUST002',
      items: 2,
      total: '$2,250',
      status: 'Completed',
      paymentStatus: 'Paid'
    },
    { 
      id: 'S003', 
      date: '2025-04-22', 
      customer: 'Natural Wellness',
      customerId: 'CUST003',
      items: 1,
      total: '$3,600',
      status: 'Completed',
      paymentStatus: 'Unpaid'
    },
    { 
      id: 'S004', 
      date: '2025-04-21', 
      customer: 'Organic Remedies',
      customerId: 'CUST004',
      items: 4,
      total: '$5,400',
      status: 'Processing',
      paymentStatus: 'Partial'
    },
    { 
      id: 'S005', 
      date: '2025-04-20', 
      customer: 'Pure Hemp Collective',
      customerId: 'CUST005',
      items: 2,
      total: '$3,200',
      status: 'Completed',
      paymentStatus: 'Paid'
    },
  ];

  // Table columns
  const columns = [
    { id: 'id', label: 'Order ID' },
    { id: 'date', label: 'Date' },
    { id: 'customer', label: 'Customer' },
    { id: 'items', label: 'Items', align: 'center' },
    { id: 'total', label: 'Total', align: 'right' },
    { id: 'status', label: 'Status',
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Completed' ? 'success' : value === 'Processing' ? 'warning' : 'error'} 
        />
      )
    },
    { id: 'paymentStatus', label: 'Payment',
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Paid' ? 'success' : value === 'Partial' ? 'warning' : 'error'} 
          variant={value === 'Paid' ? 'filled' : 'outlined'}
        />
      )
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      align: 'right',
      format: (_, row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button 
            component={Link}
            href={`/dashboard/sales/${row.id}`}
            variant="outlined" 
            size="small"
          >
            View
          </Button>
          <Button 
            component={Link}
            href={`/dashboard/sales/${row.id}/invoice`}
            variant="outlined" 
            size="small"
            color="secondary"
          >
            Invoice
          </Button>
        </Stack>
      )
    },
  ];

  // Filter data based on search query and tab
  const filteredData = salesData.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && item.status === 'Completed';
    if (tabValue === 2) return matchesSearch && item.status === 'Processing';
    if (tabValue === 3) return matchesSearch && item.paymentStatus === 'Unpaid';
    
    return matchesSearch;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Sales summary data
  const salesSummary = [
    { title: 'Total Sales', value: '$18,950', period: 'This Month' },
    { title: 'Completed Orders', value: '12', period: 'This Month' },
    { title: 'Processing Orders', value: '3', period: 'Current' },
    { title: 'Unpaid Invoices', value: '$4,800', period: 'Outstanding' },
  ];

  return (
    <Box>
      <PageHeader 
        title="Sales Management" 
        description="Manage your sales orders and invoices"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Sales', href: '/dashboard/sales' },
        ]}
        actions={
          <Button 
            component={Link}
            href="/dashboard/sales/new"
            variant="contained" 
            startIcon={<AddIcon />}
          >
            New Sale
          </Button>
        }
      />
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {salesSummary.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <Typography variant="subtitle2" color="text.secondary">
                {item.title}
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.period}
              </Typography>
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
                placeholder="Search by order ID or customer"
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
              <Button 
                variant="outlined" 
                startIcon={<ReceiptIcon />}
                sx={{ mr: 1 }}
              >
                Generate Report
              </Button>
              <Button variant="outlined">
                Export
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Orders" />
            <Tab label="Completed" />
            <Tab label="Processing" />
            <Tab label="Unpaid" />
          </Tabs>
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
