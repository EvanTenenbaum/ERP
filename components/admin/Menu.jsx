'use client';

import React from 'react';
import { Menu as ReactAdminMenu } from 'react-admin';
import { 
  Dashboard as DashboardIcon,
  ShoppingCart as SalesIcon,
  People as CustomersIcon,
  Inventory as InventoryIcon,
  Category as ProductsIcon,
  LocalShipping as VendorsIcon,
  Assessment as ReportsIcon
} from '@mui/icons-material';

/**
 * Menu - Custom Menu component for the React-admin framework
 * 
 * This component customizes the sidebar menu of the React-admin interface
 * to match the Hemp Flower Wholesale ERP system navigation structure.
 */
const Menu = (props) => {
  return (
    <ReactAdminMenu
      {...props}
      sx={{
        '& .RaMenu-item': {
          borderRadius: '4px',
          margin: '5px 0',
        },
        '& .RaMenu-item.RaMenu-active': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <ReactAdminMenu.DashboardItem 
        leftIcon={<DashboardIcon />} 
        primaryText="Dashboard" 
      />
      <ReactAdminMenu.Item 
        to="/reports/sales" 
        primaryText="Sales" 
        leftIcon={<SalesIcon />} 
      />
      <ReactAdminMenu.Item 
        to="/reports/customers" 
        primaryText="Customers" 
        leftIcon={<CustomersIcon />} 
      />
      <ReactAdminMenu.Item 
        to="/reports/products" 
        primaryText="Products" 
        leftIcon={<ProductsIcon />} 
      />
      <ReactAdminMenu.Item 
        to="/reports/inventory" 
        primaryText="Inventory" 
        leftIcon={<InventoryIcon />} 
      />
      <ReactAdminMenu.Item 
        to="/reports/vendors" 
        primaryText="Vendors" 
        leftIcon={<VendorsIcon />} 
      />
      <ReactAdminMenu.Item 
        to="/reports/advanced" 
        primaryText="Advanced Reports" 
        leftIcon={<ReportsIcon />} 
      />
    </ReactAdminMenu>
  );
};

export { Menu };
