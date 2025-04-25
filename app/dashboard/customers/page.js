'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card as MuiCard, 
  CardContent, 
  CardActionArea,
  Fab,
  IconButton,
  useMediaQuery,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PageHeader from '../../../components/ui/PageHeader';
import { useRouter } from 'next/navigation';

export default function MobileCustomersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState(isMobile ? 'list' : 'grid');
  
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
      creditLimit: 50000,
      totalPurchases: 124500,
      avatar: 'G'
    },
    { 
      id: 'CUST002', 
      name: 'Herbal Solutions', 
      contact: 'Sarah Johnson', 
      email: 'sarah@herbalsolutions.com', 
      phone: '(555) 234-5678', 
      location: 'Denver, CO',
      status: 'Active',
      creditLimit: 35000,
      totalPurchases: 87200,
      avatar: 'H'
    },
    { 
      id: 'CUST003', 
      name: 'Natural Wellness', 
      contact: 'Michael Brown', 
      email: 'michael@naturalwellness.com', 
      phone: '(555) 345-6789', 
      location: 'Portland, OR',
      status: 'Active',
      creditLimit: 25000,
      totalPurchases: 62800,
      avatar: 'N'
    },
    { 
      id: 'CUST004', 
      name: 'Organic Remedies', 
      contact: 'Jessica Davis', 
      email: 'jessica@organicremedies.com', 
      phone: '(555) 456-7890', 
      location: 'Seattle, WA',
      status: 'Inactive',
      creditLimit: 15000,
      totalPurchases: 8500,
      avatar: 'O'
    },
    { 
      id: 'CUST005', 
      name: 'Pure Hemp Collective', 
      contact: 'David Wilson', 
      email: 'david@purehempcollective.com', 
      phone: '(555) 567-8901', 
      location: 'Austin, TX',
      status: 'Active',
      creditLimit: 40000,
      totalPurchases: 95300,
      avatar: 'P'
    },
  ];
  
  // Filter data based on search query
  const filteredData = customersData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Box sx={{ pb: isMobile ? 8 : 3 }}>
      <PageHeader 
        title="Customers"
        description={isMobile ? undefined : "Manage your wholesale customers"}
        breadcrumbs={!isMobile ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
        ] : undefined}
      />
      
      {/* Search and view toggle section */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={isMobile ? 12 : 8}>
            <TextField
              fullWidth
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { 
                  height: isMobile ? 56 : 'auto',
                  borderRadius: 28,
                  pl: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: 28,
                  }
                }
              }}
              variant="outlined"
              size={isMobile ? "medium" : "small"}
            />
          </Grid>
          
          {!isMobile && (
            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  Grid
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  List
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          )}
        </Grid>
      </Box>
      
      {/* Mobile customer list */}
      {(isMobile || viewMode === 'list') ? (
        <List sx={{ p: 0 }}>
          {filteredData.map((customer) => (
            <Paper 
              key={customer.id} 
              elevation={1}
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <CardActionArea 
                onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
              >
                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: customer.status === 'Active' ? 'primary.main' : 'text.disabled',
                        width: 50,
                        height: 50,
                        fontSize: '1.5rem'
                      }}
                    >
                      {customer.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="div" fontWeight="medium" noWrap>
                          {customer.name}
                        </Typography>
                        <Chip 
                          label={customer.status} 
                          size="small" 
                          color={customer.status === 'Active' ? 'success' : 'default'} 
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {customer.contact} • {customer.location}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Credit: {formatCurrency(customer.creditLimit)}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" color="primary">
                            {formatCurrency(customer.totalPurchases)}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              </CardActionArea>
            </Paper>
          ))}
        </List>
      ) : (
        // Desktop grid view
        <Grid container spacing={3}>
          {filteredData.map((customer) => (
            <Grid item xs={12} sm={6} md={4} key={customer.id}>
              <MuiCard sx={{ height: '100%', borderRadius: 2 }}>
                <CardActionArea onClick={() => router.push(`/dashboard/customers/${customer.id}`)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: customer.status === 'Active' ? 'primary.main' : 'text.disabled',
                          width: 60,
                          height: 60,
                          fontSize: '1.75rem',
                          mr: 2
                        }}
                      >
                        {customer.avatar}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" component="div">
                            {customer.name}
                          </Typography>
                          <Chip 
                            label={customer.status} 
                            size="small" 
                            color={customer.status === 'Active' ? 'success' : 'default'} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {customer.id}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Contact:</strong> {customer.contact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Location:</strong> {customer.location}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Credit Limit</Typography>
                        <Typography variant="h6">{formatCurrency(customer.creditLimit)}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">Total Purchases</Typography>
                        <Typography variant="h6" color="primary">{formatCurrency(customer.totalPurchases)}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </MuiCard>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Floating action button for adding new customer (mobile only) */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 80, // Position above bottom navigation
            right: 16,
            zIndex: 999
          }}
          onClick={() => router.push('/dashboard/customers/new')}
        >
          <PersonAddIcon />
        </Fab>
      )}
      
      {/* Desktop add button */}
      {!isMobile && (
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ mt: 3 }}
          onClick={() => router.push('/dashboard/customers/new')}
        >
          Add Customer
        </Button>
      )}
    </Box>
  );
}
