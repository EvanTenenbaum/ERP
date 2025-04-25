'use client';

import React from 'react';

/**
 * Badge component for displaying status or category labels
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.variant='default'] - Badge variant (default, success, warning, error, info)
 * @param {string} [props.size='default'] - Badge size (sm, default, lg)
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Combine all styles
  const badgeStyles = `${baseStyles} ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.default} ${className}`;
  
  return (
    <span className={badgeStyles} {...props}>
      {children}
    </span>
  );
}
