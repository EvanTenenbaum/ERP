'use client';

import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme, size, fullWidth }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  ...(fullWidth && {
    width: '100%',
  }),
  ...(size === 'sm' && {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
  }),
  ...(size === 'lg' && {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
  }),
}));

/**
 * Button component for triggering actions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.variant='contained'] - Button variant (contained, outlined, text)
 * @param {string} [props.color='primary'] - Button color (primary, secondary, error, warning, info, success)
 * @param {string} [props.size='medium'] - Button size (small, medium, large, sm, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take up the full width
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether to show a loading indicator
 * @param {function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  // Map custom sizes to MUI sizes
  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : size;
  
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={muiSize}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={muiSize === 'small' ? 16 : muiSize === 'large' ? 24 : 20}
            color="inherit"
            sx={{ mr: 1 }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
}
