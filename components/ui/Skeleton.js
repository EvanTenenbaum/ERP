'use client';

import React from 'react';

/**
 * Skeleton component for loading states
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Skeleton variant (default, circle, text)
 * @param {string} [props.width] - Width of the skeleton
 * @param {string} [props.height] - Height of the skeleton
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Skeleton({
  variant = 'default',
  width,
  height,
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  // Variant styles
  const variantStyles = {
    default: 'rounded',
    circle: 'rounded-full',
    text: 'h-4 rounded',
  };
  
  // Inline styles for width and height
  const inlineStyles = {
    width: width || 'auto',
    height: height || (variant === 'text' ? '1rem' : 'auto'),
  };
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
      style={inlineStyles}
      {...props}
    />
  );
}
