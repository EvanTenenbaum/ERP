'use client';

import React from 'react';

/**
 * Card component for displaying content in a boxed container
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Optional card title
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.noPadding=false] - Whether to remove padding
 */
export default function Card({
  children,
  title,
  className = '',
  noPadding = false,
  ...props
}) {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
}
