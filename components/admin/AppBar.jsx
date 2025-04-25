'use client';

import React from 'react';
import { AppBar as ReactAdminAppBar, TitlePortal } from 'react-admin';
import { Typography, Box } from '@mui/material';

/**
 * AppBar - Custom AppBar component for the React-admin framework
 * 
 * This component customizes the top navigation bar of the React-admin interface
 * to match the Hemp Flower Wholesale ERP system design.
 */
const AppBar = (props) => {
  return (
    <ReactAdminAppBar
      {...props}
      color="primary"
      elevation={1}
      sx={{
        '& .RaAppBar-title': {
          flex: 1,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
      }}
    >
      <TitlePortal />
      <Box flex={1} />
      <Typography variant="body2" sx={{ marginRight: 2 }}>
        Hemp Flower Wholesale ERP
      </Typography>
    </ReactAdminAppBar>
  );
};

export { AppBar };
