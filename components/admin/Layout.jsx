'use client';

import React from 'react';
import { Layout as ReactAdminLayout } from 'react-admin';
import { AppBar } from './AppBar';
import { Menu } from './Menu';

/**
 * Layout - Custom layout component for the React-admin framework
 * 
 * This component customizes the appearance and behavior of the React-admin interface
 * to match the Hemp Flower Wholesale ERP system design.
 */
const Layout = (props) => {
  return (
    <ReactAdminLayout
      {...props}
      appBar={AppBar}
      menu={Menu}
      sx={{
        '& .RaLayout-content': {
          padding: '20px',
          backgroundColor: '#f5f5f5',
        },
      }}
    />
  );
};

export { Layout };
