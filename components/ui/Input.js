'use client';

import React from 'react';
import { TextField as MuiTextField, InputAdornment, FormHelperText, FormControl, InputLabel, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2)
}));

/**
 * Input component for text entry
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Input id
 * @param {string} [props.name] - Input name
 * @param {string} [props.label] - Input label
 * @param {string} [props.value] - Input value
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.type='text'] - Input type (text, password, email, etc.)
 * @param {string} [props.variant='outlined'] - Input variant (outlined, filled, standard)
 * @param {string} [props.size='medium'] - Input size (small, medium)
 * @param {boolean} [props.fullWidth=true] - Whether the input should take up the full width
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {boolean} [props.error=false] - Whether the input has an error
 * @param {string} [props.helperText] - Helper text to display below the input
 * @param {React.ReactNode} [props.startAdornment] - Content to display at the start of the input
 * @param {React.ReactNode} [props.endAdornment] - Content to display at the end of the input
 * @param {function} [props.onChange] - Change handler
 * @param {function} [props.onBlur] - Blur handler
 * @param {function} [props.onFocus] - Focus handler
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Input({
  id,
  name,
  label,
  value,
  placeholder,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText,
  startAdornment,
  endAdornment,
  onChange,
  onBlur,
  onFocus,
  className = '',
  ...props
}) {
  const inputProps = {};
  
  if (startAdornment) {
    inputProps.startAdornment = (
      <InputAdornment position="start">{startAdornment}</InputAdornment>
    );
  }
  
  if (endAdornment) {
    inputProps.endAdornment = (
      <InputAdornment position="end">{endAdornment}</InputAdornment>
    );
  }
  
  return (
    <StyledFormControl error={error} className={className}>
      {label && (
        <FormLabel htmlFor={id} required={required} sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <MuiTextField
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        required={required}
        disabled={disabled}
        error={error}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        InputProps={Object.keys(inputProps).length > 0 ? inputProps : undefined}
        {...props}
      />
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
}
