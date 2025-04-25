'use client';

import React from 'react';

/**
 * EmptyState component for displaying when no data is available
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {string} [props.description] - Optional description text
 * @param {React.ReactNode} [props.action] - Optional action button
 * @param {React.ReactNode} [props.icon] - Optional icon
 * @param {string} [props.className] - Additional CSS classes
 */
export default function EmptyState({
  title,
  description,
  action,
  icon,
  className = '',
  ...props
}) {
  return (
    <div 
      className={`text-center py-12 px-4 ${className}`}
      {...props}
    >
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
