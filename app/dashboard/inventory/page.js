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
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/ui/PageHeader';
import Table from '../../../components/ui/Table';
import Link from 'next/link';

export default function InventoryPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample inventory data
  const inventoryData = [
    { 
      id: 'INV001', 
      sku: 'VEN001-PH-001', 
      name: 'Purple Haze', 
      category: 'Indoor', 
      strain: 'Sativa', 
      quantity: 25, 
      price: '$45.00', 
      location: 'Warehouse A',
      status: 'In Stock'
    },
    { 
      id: 'INV002', 
      sku: 'VEN002-OGK-001', 
      name: 'OG Kush', 
      category: 'Indoor', 
      strain: 'Indica', 
      quantity: 5, 
      price: '$50.00', 
      location: 'Warehouse B',
      status: 'Low Stock'
    },
    { 
      id: 'INV003', 
      sku: 'VEN003-BD-002', 
      name: 'Blue Dream', 
      category: 'Light Dep', 
      strain: 'Hybrid', 
      quantity: 18, 
      price: '$40.00', 
      location: 'Warehouse A',
      status: 'In Stock'
    },
    { 
      id: 'INV004', 
      sku: 'VEN001-SD-003', 
      name: 'Sour Diesel', 
      category: 'Outdoor', 
      strain: 'Sativa', 
      quantity: 30, 
      price: '$35.00', 
      location: 'Warehouse C',
      status: 'In Stock'
    },
    { 
      id: 'INV005', 
      sku: 'VEN004-GG-001', 
      name: 'Gorilla Glue', 
      category: 'Indoor', 
      strain: 'Hybrid', 
      quantity: 12, 
      price: '$48.00', 
      location: 'Warehouse A',
      status: 'In Stock'
    },
  ];

  // Table columns
  const columns = [
    { id: 'sku', label: 'SKU' },
    { id: 'name', label: 'Product Name' },
    { id: 'category', label: 'Category', 
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Indoor' ? 'primary' : value === 'Light Dep' ? 'secondary' : 'default'} 
          variant="outlined" 
        />
      )
    },
    { id: 'strain', label: 'Strain',
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'Sativa' ? 'success' : value === 'Indica' ? 'info' : 'warning'} 
          variant="outlined" 
        />
      )
    },
    { id: 'quantity', label: 'Quantity', align: 'right' },
    { id: 'price', label: 'Price', align: 'right' },
    { id: 'location', label: 'Location' },
    { id: 'status', label: 'Status',
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'In Stock' ? 'success' : 'error'} 
        />
      )
    },
  ];

  // Filter data based on search query
  const filteredData = inventoryData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <PageHeader 
        title="Inventory Management" 
        description="Manage your hemp flower inventory across all locations"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Inventory', href: '/dashboard/inventory' },
        ]}
        actions={
          <Button 
            component={Link}
            href="/dashboard/inventory/add"
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Add Product
          </Button>
        }
      />
      
      <Card>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by product name or SKU"
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
                startIcon={<FilterListIcon />}
                sx={{ mr: 1 }}
              >
                Filter
              </Button>
              <Button variant="outlined">
                Export
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Products" />
            <Tab label="Indoor" />
            <Tab label="Light Dep" />
            <Tab label="Outdoor" />
            <Tab label="Low Stock" />
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
