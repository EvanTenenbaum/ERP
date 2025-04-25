'use client';

import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  MenuItem, 
  FormHelperText,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2)
}));

/**
 * Select component for dropdown selection
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Select id
 * @param {string} [props.name] - Select name
 * @param {string} [props.label] - Select label
 * @param {any} [props.value] - Selected value
 * @param {Array} props.options - Array of option objects with 'value' and 'label' properties
 * @param {string} [props.placeholder] - Placeholder text when no option is selected
 * @param {string} [props.variant='outlined'] - Select variant (outlined, filled, standard)
 * @param {string} [props.size='medium'] - Select size (small, medium)
 * @param {boolean} [props.fullWidth=true] - Whether the select should take up the full width
 * @param {boolean} [props.required=false] - Whether the select is required
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {boolean} [props.error=false] - Whether the select has an error
 * @param {string} [props.helperText] - Helper text to display below the select
 * @param {function} [props.onChange] - Change handler
 * @param {function} [props.onBlur] - Blur handler
 * @param {function} [props.onFocus] - Focus handler
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Select({
  id,
  name,
  label,
  value,
  options = [],
  placeholder,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText,
  onChange,
  onBlur,
  onFocus,
  className = '',
  ...props
}) {
  return (
    <StyledFormControl 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth} 
      error={error} 
      required={required}
      disabled={disabled}
      className={className}
    >
      {label && (
        <FormLabel htmlFor={id} required={required} sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <MuiSelect
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        displayEmpty={!!placeholder}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
}
