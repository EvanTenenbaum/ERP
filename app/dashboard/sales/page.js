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
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PageHeader from '../../../components/ui/PageHeader';
import { useRouter } from 'next/navigation';

export default function MobileSalesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Sample sales data
  const salesData = [
    { 
      id: 'S001', 
      date: '2025-04-24', 
      customer: 'Greenleaf Distributors',
      customerId: 'CUST001',
      items: 3,
      total: 4500,
      status: 'Completed',
      paymentStatus: 'Paid'
    },
    { 
      id: 'S002', 
      date: '2025-04-23', 
      customer: 'Herbal Solutions',
      customerId: 'CUST002',
      items: 2,
      total: 2250,
      status: 'Completed',
      paymentStatus: 'Paid'
    },
    { 
      id: 'S003', 
      date: '2025-04-22', 
      customer: 'Natural Wellness',
      customerId: 'CUST003',
      items: 1,
      total: 3600,
      status: 'Completed',
      paymentStatus: 'Unpaid'
    },
    { 
      id: 'S004', 
      date: '2025-04-21', 
      customer: 'Organic Remedies',
      customerId: 'CUST004',
      items: 4,
      total: 5400,
      status: 'Processing',
      paymentStatus: 'Partial'
    },
    { 
      id: 'S005', 
      date: '2025-04-20', 
      customer: 'Pure Hemp Collective',
      customerId: 'CUST005',
      items: 2,
      total: 3200,
      status: 'Completed',
      paymentStatus: 'Paid'
    },
  ];
  
  // Filter data based on search query
  const filteredData = salesData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Sales summary data
  const salesSummary = [
    { title: 'Total Sales', value: '$18,950', period: 'This Month' },
    { title: 'Completed Orders', value: '12', period: 'This Month' },
    { title: 'Processing Orders', value: '3', period: 'Current' },
    { title: 'Unpaid Invoices', value: '$4,800', period: 'Outstanding' },
  ];
  
  return (
    <Box sx={{ pb: isMobile ? 8 : 3 }}>
      <PageHeader 
        title="Sales"
        description={isMobile ? undefined : "Manage your sales orders and invoices"}
        breadcrumbs={!isMobile ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Sales', href: '/dashboard/sales' },
        ] : undefined}
      />
      
      {/* Sales summary cards - scrollable horizontally on mobile */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'row' : 'row',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: 2,
          mb: 3,
          overflowX: isMobile ? 'auto' : 'visible',
          pb: isMobile ? 1 : 0,
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {salesSummary.map((item, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{ 
              p: 2, 
              borderRadius: 2,
              minWidth: isMobile ? 180 : 'auto',
              flex: isMobile ? '0 0 auto' : '1 1 0',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {item.title}
            </Typography>
            <Typography variant="h4" sx={{ my: 1 }}>
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.period}
            </Typography>
          </Paper>
        ))}
      </Box>
      
      {/* Search section */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search sales..."
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
      </Box>
      
      {/* Filter chips - scrollable horizontally */}
      <Box 
        sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          pb: 1,
          mb: 2,
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <Chip
          label="All Orders"
          onClick={() => {}}
          color="primary"
          variant="filled"
          sx={{ 
            mr: 1, 
            height: 40, 
            borderRadius: 20,
            '& .MuiChip-label': {
              px: 2
            }
          }}
        />
        <Chip
          label="Completed"
          onClick={() => {}}
          color="default"
          variant="outlined"
          sx={{ 
            mr: 1, 
            height: 40, 
            borderRadius: 20,
            '& .MuiChip-label': {
              px: 2
            }
          }}
        />
        <Chip
          label="Processing"
          onClick={() => {}}
          color="default"
          variant="outlined"
          sx={{ 
            mr: 1, 
            height: 40, 
            borderRadius: 20,
            '& .MuiChip-label': {
              px: 2
            }
          }}
        />
        <Chip
          label="Unpaid"
          onClick={() => {}}
          color="default"
          variant="outlined"
          sx={{ 
            mr: 1, 
            height: 40, 
            borderRadius: 20,
            '& .MuiChip-label': {
              px: 2
            }
          }}
        />
      </Box>
      
      {/* Mobile sales list */}
      {isMobile ? (
        <List sx={{ p: 0 }}>
          {filteredData.map((sale) => (
            <Paper 
              key={sale.id} 
              elevation={1}
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <CardActionArea 
                onClick={() => router.push(`/dashboard/sales/${sale.id}`)}
              >
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" component="div" fontWeight="medium">
                        {sale.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(sale.date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Chip 
                        label={sale.status} 
                        size="small" 
                        color={sale.status === 'Completed' ? 'success' : 'warning'} 
                        sx={{ mb: 1 }}
                      />
                      <Chip 
                        label={sale.paymentStatus} 
                        size="small" 
                        color={
                          sale.paymentStatus === 'Paid' ? 'success' : 
                          sale.paymentStatus === 'Partial' ? 'warning' : 'error'
                        } 
                        variant={sale.paymentStatus === 'Paid' ? 'filled' : 'outlined'}
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {sale.customer}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Items: {sale.items}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(sale.total)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        borderRadius: 20,
                        minHeight: 36,
                        px: 2
                      }}
                    >
                      View Invoice
                    </Button>
                  </Box>
                </Box>
              </CardActionArea>
            </Paper>
          ))}
        </List>
      ) : (
        // Desktop table-like view
        <Grid container spacing={3}>
          {filteredData.map((sale) => (
            <Grid item xs={12} sm={6} md={4} key={sale.id}>
              <MuiCard sx={{ height: '100%', borderRadius: 2 }}>
                <CardActionArea onClick={() => router.push(`/dashboard/sales/${sale.id}`)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="div">
                          {sale.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(sale.date)}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={sale.status} 
                          size="small" 
                          color={sale.status === 'Completed' ? 'success' : 'warning'} 
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      {sale.customer}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Items</Typography>
                        <Typography variant="h6">{sale.items}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Payment</Typography>
                        <Chip 
                          label={sale.paymentStatus} 
                          size="small" 
                          color={
                            sale.paymentStatus === 'Paid' ? 'success' : 
                            sale.paymentStatus === 'Partial' ? 'warning' : 'error'
                          } 
                          variant={sale.paymentStatus === 'Paid' ? 'filled' : 'outlined'}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">Total</Typography>
                        <Typography variant="h6" color="primary">{formatCurrency(sale.total)}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                      >
                        View Invoice
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </MuiCard>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Floating action button for adding new sale (mobile only) */}
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
          onClick={() => router.push('/dashboard/sales/new')}
        >
          <AddIcon />
        </Fab>
      )}
      
      {/* Desktop add button */}
      {!isMobile && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 3 }}
          onClick={() => router.push('/dashboard/sales/new')}
        >
          New Sale
        </Button>
      )}
    </Box>
  );
}
