'use client';

import React from 'react';
import { 
  Card as MuiCard, 
  CardContent, 
  CardHeader, 
  CardActions,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme, variant }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  })
}));

/**
 * Card component for displaying content in a contained format
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {React.ReactNode} [props.action] - Action component to display in header
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {string} [props.variant='elevation'] - Card variant (elevation or outlined)
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Card({
  children,
  title,
  action,
  footer,
  variant = 'elevation',
  className = '',
  ...props
}) {
  return (
    <StyledCard variant={variant} className={className} {...props}>
      {title && (
        <CardHeader 
          title={
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          }
          action={action}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pt: title ? 0 : 2 }}>
        {children}
      </CardContent>
      {footer && (
        <CardActions>
          {footer}
        </CardActions>
      )}
    </StyledCard>
  );
}
