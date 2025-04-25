'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  BottomNavigation, 
  BottomNavigationAction,
  Fab,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine active navigation item based on current path
  const getActiveNavItem = () => {
    if (pathname.includes('/dashboard/inventory')) return 1;
    if (pathname.includes('/dashboard/customers')) return 2;
    if (pathname.includes('/dashboard/sales')) return 3;
    return 0; // Dashboard is default
  };
  
  const [navValue, setNavValue] = useState(getActiveNavItem());
  
  // Handle navigation change
  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
    
    // Navigate to the corresponding page
    switch(newValue) {
      case 0:
        router.push('/dashboard');
        break;
      case 1:
        router.push('/dashboard/inventory');
        break;
      case 2:
        router.push('/dashboard/customers');
        break;
      case 3:
        router.push('/dashboard/sales');
        break;
      default:
        router.push('/dashboard');
    }
  };
  
  // Speed dial actions for quick access to common tasks
  const actions = [
    { icon: <AddShoppingCartIcon />, name: 'New Sale', action: () => router.push('/dashboard/sales/new') },
    { icon: <AddIcon />, name: 'Add Product', action: () => router.push('/dashboard/inventory/add') },
    { icon: <PersonAddIcon />, name: 'Add Customer', action: () => router.push('/dashboard/customers/new') },
    { icon: <AddBusinessIcon />, name: 'Add Vendor', action: () => router.push('/dashboard/vendors/new') },
  ];
  
  // Toggle drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => router.push('/dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => router.push('/dashboard/inventory')}>
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
        <ListItem button onClick={() => router.push('/dashboard/customers')}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>
        <ListItem button onClick={() => router.push('/dashboard/sales')}>
          <ListItemIcon><ReceiptIcon /></ListItemIcon>
          <ListItemText primary="Sales" />
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile-specific AppBar */}
      {isMobile && (
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hemp ERP
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      
      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      
      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: isMobile ? 2 : 3,
          pb: isMobile ? 8 : 3, // Add padding at bottom for mobile navigation
          bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
      
      {/* Bottom navigation for mobile */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            borderTop: 1,
            borderColor: 'divider'
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={navValue}
            onChange={handleNavChange}
            showLabels
            sx={{ height: 64 }} // Larger touch targets
          >
            <BottomNavigationAction 
              label="Dashboard" 
              icon={<DashboardIcon />} 
              sx={{ py: 1.5 }} // Larger touch targets
            />
            <BottomNavigationAction 
              label="Inventory" 
              icon={<InventoryIcon />} 
              sx={{ py: 1.5 }} // Larger touch targets
            />
            <BottomNavigationAction 
              label="Customers" 
              icon={<PeopleIcon />} 
              sx={{ py: 1.5 }} // Larger touch targets
            />
            <BottomNavigationAction 
              label="Sales" 
              icon={<ReceiptIcon />} 
              sx={{ py: 1.5 }} // Larger touch targets
            />
          </BottomNavigation>
        </Paper>
      )}
      
      {/* Speed Dial for quick actions on mobile */}
      {isMobile && (
        <SpeedDial
          ariaLabel="Quick actions"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
          direction="up"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => {
                action.action();
                setSpeedDialOpen(false);
              }}
            />
          ))}
        </SpeedDial>
      )}
    </Box>
  );
}
