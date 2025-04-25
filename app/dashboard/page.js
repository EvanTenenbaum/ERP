'use client';
import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Grid, Card as MuiCard, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider, AppBar, Toolbar, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';

// Sample data for dashboard
const salesData = [
  { month: 'Jan', amount: 4000 },
  { month: 'Feb', amount: 3000 },
  { month: 'Mar', amount: 5000 },
  { month: 'Apr', amount: 4500 },
  { month: 'May', amount: 6000 },
  { month: 'Jun', amount: 5500 },
];

const recentActivities = [
  { id: 1, type: 'inventory', action: 'Added new product', item: 'Purple Haze', time: '2 hours ago' },
  { id: 2, type: 'sale', action: 'New sale completed', item: 'Order #1234', time: '3 hours ago' },
  { id: 3, type: 'customer', action: 'New customer added', item: 'Green Fields LLC', time: '5 hours ago' },
  { id: 4, type: 'payment', action: 'Payment received', item: '$1,250.00 from Herbal Solutions', time: '1 day ago' },
];

const inventoryAlerts = [
  { id: 1, type: 'low_stock', product: 'OG Kush', units: 5, action: 'Restock' },
  { id: 2, type: 'verification', product: 'Blue Dream (Batch #BD-2023-05)', action: 'Verify' },
];

// Card component for consistent styling
const Card = ({ title, children, ...props }) => (
  <MuiCard {...props} sx={{ height: '100%', ...props.sx }}>
    <CardContent>
      {title && (
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      {children}
    </CardContent>
  </MuiCard>
);

export default function DashboardPage() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Navigation Bar */}
      <AppBar position="static" color="default" elevation={0} sx={{ mb: 3, borderRadius: 1 }}>
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
            Dashboard
          </Typography>
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
          <Button 
            component={Link} 
            href="/dashboard/reports" 
            color="inherit"
            sx={{ mx: 1 }}
          >
            Reports
          </Button>
        </Toolbar>
      </AppBar>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card title="Sales Overview">
                {/* Sales chart would go here */}
                <Typography variant="body2" color="text.secondary">
                  Sales data visualization
                </Typography>
              </Card>
            </Grid>
            
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
