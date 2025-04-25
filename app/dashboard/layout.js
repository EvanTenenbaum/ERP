'use client';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../lib/context/AppContext';
import ResponsiveLayout from '../../components/ui/layout/ResponsiveLayout';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9', // Light blue color from the original CSS
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6366f1', // Indigo color for secondary actions
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#fff',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          padding: '0.5rem 1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(229, 231, 235, 1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0.75rem 1rem',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f9fafb',
        },
      },
    },
  },
});

// Create a dark theme
const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#fff',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
    },
  },
  components: {
    ...theme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(55, 65, 81, 1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0.75rem 1rem',
          borderBottom: '1px solid rgba(55, 65, 81, 1)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#1f2937',
        },
      },
    },
  },
});

export default function DashboardLayout({ children }) {
  // You can implement theme switching logic here if needed
  const [mode, setMode] = React.useState('light');
  const currentTheme = mode === 'light' ? theme : darkTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <AppProvider>
        <ResponsiveLayout>
          {children}
        </ResponsiveLayout>
      </AppProvider>
    </ThemeProvider>
  );
}
