'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function DashboardPage() {
  // Sample metrics data
  const metrics = [
    { title: 'Total Inventory', value: '152 SKUs', change: '+12%', changeType: 'positive' },
    { title: 'Active Customers', value: '38', change: '+5%', changeType: 'positive' },
    { title: 'Monthly Sales', value: '$124,500', change: '+8%', changeType: 'positive' },
    { title: 'Pending Orders', value: '12', change: '-3%', changeType: 'negative' },
  ];

  // Sample recent activities
  const recentActivities = [
    { id: 1, type: 'inventory', action: 'New inventory added', item: 'Purple Haze (VEN001-PH-001)', time: '2 hours ago' },
    { id: 2, type: 'sale', action: 'New sale completed', item: 'Order #1234 - Greenleaf Distributors', time: '4 hours ago' },
    { id: 3, type: 'customer', action: 'New customer added', item: 'Organic Remedies (CUST005)', time: '1 day ago' },
    { id: 4, type: 'payment', action: 'Payment received', item: 'Invoice #5678 - Herbal Solutions', time: '2 days ago' },
  ];

  // Sample inventory alerts
  const inventoryAlerts = [
    { id: 1, type: 'low_stock', product: 'OG Kush', units: 5, action: 'Restock' },
    { id: 2, type: 'verification', product: 'Blue Dream (VEN003-BD-002)', action: 'Verify' },
  ];

  // Recent sales data for table
  const recentSales = [
    { id: 'S001', customer: 'Greenleaf Distributors', product: 'Purple Haze', quantity: 10, total: '$4,500', date: '2025-04-24' },
    { id: 'S002', customer: 'Herbal Solutions', product: 'OG Kush', quantity: 5, total: '$2,250', date: '2025-04-23' },
    { id: 'S003', customer: 'Natural Wellness', product: 'Blue Dream', quantity: 8, total: '$3,600', date: '2025-04-22' },
    { id: 'S004', customer: 'Organic Remedies', product: 'Sour Diesel', quantity: 12, total: '$5,400', date: '2025-04-21' },
  ];

  // Table columns
  const salesColumns = [
    { id: 'id', label: 'Order ID' },
    { id: 'customer', label: 'Customer' },
    { id: 'product', label: 'Product' },
    { id: 'quantity', label: 'Quantity', align: 'right' },
    { id: 'total', label: 'Total', align: 'right' },
    { id: 'date', label: 'Date' },
  ];

  return (
    <Box>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your hemp flower wholesale business"
        actions={
          <>
            <Button variant="outlined" size="small" startIcon={<DashboardIcon />}>
              Refresh
            </Button>
            <Button variant="contained" size="small" startIcon={<ReceiptIcon />}>
              New Sale
            </Button>
          </>
        }
      />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <Typography variant="subtitle2" color="text.secondary">
                {metric.title}
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {metric.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {metric.changeType === 'positive' ? (
                  <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography 
                  variant="body2" 
                  color={metric.changeType === 'positive' ? 'success.main' : 'error.main'}
                >
                  {metric.change} from last month
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card title="Recent Sales">
            <Table 
              columns={salesColumns} 
              data={recentSales}
              pagination={false}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                component={Link} 
                href="/dashboard/sales" 
                variant="text" 
                size="small"
              >
                View All Sales
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card title="Recent Activity">
                <List disablePadding>
                  {recentActivities.map((activity) => (
                    <ListItem 
                      key={activity.id} 
                      divider={activity.id !== recentActivities.length}
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {activity.type === 'inventory' && <InventoryIcon color="primary" />}
                        {activity.type === 'sale' && <ReceiptIcon color="success" />}
                        {activity.type === 'customer' && <PeopleIcon color="info" />}
                        {activity.type === 'payment' && <DashboardIcon color="warning" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={activity.action}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {activity.item}
                            </Typography>
                            <Typography variant="caption" component="div" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
            
            <Grid item>
              <Card title="Inventory Alerts">
                <List disablePadding>
                  {inventoryAlerts.map((alert, index) => (
                    <ListItem 
                      key={alert.id}
                      divider={index !== inventoryAlerts.length - 1}
                      sx={{ 
                        px: 2, 
                        py: 1.5, 
                        backgroundColor: alert.type === 'low_stock' ? 'error.lighter' : 'warning.lighter',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {alert.type === 'low_stock' ? (
                          <WarningIcon color="error" />
                        ) : (
                          <CheckCircleIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {alert.type === 'low_stock' ? 'Low Stock' : 'Pending Verification'}
                          </Typography>
                        }
                        secondary={
                          alert.type === 'low_stock' ? 
                            `${alert.product} (${alert.units} units)` : 
                            alert.product
                        }
                      />
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color={alert.type === 'low_stock' ? 'error' : 'warning'}
                      >
                        {alert.action}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card title="Quick Actions">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button 
                  component={Link}
                  href="/dashboard/inventory/add"
                  variant="outlined"
                  fullWidth
                  startIcon={<InventoryIcon />}
                >
                  Add Inventory
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  component={Link}
                  href="/dashboard/customers/new"
                  variant="outlined"
                  fullWidth
                  startIcon={<PeopleIcon />}
                >
                  Add Customer
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  component={Link}
                  href="/dashboard/sales/new"
                  variant="outlined"
                  fullWidth
                  startIcon={<ReceiptIcon />}
                >
                  Create Sale
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  component={Link}
                  href="/dashboard/reports"
                  variant="outlined"
                  fullWidth
                  startIcon={<DashboardIcon />}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
