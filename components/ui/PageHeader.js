'use client';

import React from 'react';

/**
 * PageHeader component for consistent page headers
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} [props.description] - Optional page description
 * @param {React.ReactNode} [props.actions] - Optional action buttons
 * @param {string} [props.className] - Additional CSS classes
 */
export default function PageHeader({
  title,
  description,
  actions,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        {actions && (
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
