'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Stack
} from '@mui/material';
import Link from 'next/link';

/**
 * PageHeader component for consistent page headers
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} [props.description] - Optional page description
 * @param {React.ReactNode} [props.actions] - Optional action buttons
 * @param {Array} [props.breadcrumbs] - Optional breadcrumbs array of {label, href} objects
 * @param {string} [props.className] - Additional CSS classes
 */
export default function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className = '',
  ...props
}) {
  return (
    <Box 
      className={`page-header ${className}`}
      sx={{ 
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2
      }}
      {...props}
    >
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <MuiBreadcrumbs sx={{ mb: 1 }}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <Typography color="text.primary">{crumb.label}</Typography>
                )}
              </React.Fragment>
            ))}
          </MuiBreadcrumbs>
        )}
        
        <Typography variant="h4" component="h1" gutterBottom={!!description}>
          {title}
        </Typography>
        
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      
      {actions && (
        <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, md: 0 } }}>
          {actions}
        </Stack>
      )}
    </Box>
  );
}
