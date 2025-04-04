import React from 'react';

/**
 * Button component with various styles and options
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Button variant (default, outline, ghost)
 * @param {string} [props.size='default'] - Button size (sm, default, lg)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 * @param {function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 */
export default function Button({
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  };
  
  // Size styles
  const sizeStyles = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.default} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
