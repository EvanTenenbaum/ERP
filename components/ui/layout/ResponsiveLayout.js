'use client';

import React from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  useMediaQuery
} from '@mui/material';
import { useState, useEffect } from 'react';
import MobileLayout from './MobileLayout';
import MainLayout from './MainLayout';
import { AppProvider } from '../../../lib/context/AppContext';

// Create responsive theme with mobile-first approach
const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
      },
      secondary: {
        main: '#8561c5',
        light: '#9d7eda',
        dark: '#6247aa',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2rem',
        '@media (min-width:600px)': {
          fontSize: '2.5rem',
        },
      },
      h2: {
        fontSize: '1.75rem',
        '@media (min-width:600px)': {
          fontSize: '2rem',
        },
      },
      h3: {
        fontSize: '1.5rem',
        '@media (min-width:600px)': {
          fontSize: '1.75rem',
        },
      },
      h4: {
        fontSize: '1.25rem',
        '@media (min-width:600px)': {
          fontSize: '1.5rem',
        },
      },
      h5: {
        fontSize: '1.1rem',
        '@media (min-width:600px)': {
          fontSize: '1.25rem',
        },
      },
      h6: {
        fontSize: '1rem',
        '@media (min-width:600px)': {
          fontSize: '1.1rem',
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
            '@media (max-width:600px)': {
              padding: '10px 20px',
              minHeight: 48,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              '@media (max-width:600px)': {
                fontSize: '1rem',
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.05)'
              : '0px 2px 4px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            '@media (max-width:600px)': {
              height: 32,
              fontSize: '0.875rem',
            },
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 64,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            padding: '12px 0',
            minWidth: 80,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '@media (max-width:600px)': {
              paddingTop: 12,
              paddingBottom: 12,
            },
          },
        },
      },
      MuiTouchRipple: {
        styleOverrides: {
          root: {
            // Faster ripple effect for better mobile feedback
            animationDuration: '450ms',
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
  });
};

export default function ResponsiveLayout({ children }) {
  // Use system preference for theme mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState('light');
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Set theme mode based on system preference
  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);
  
  // Create theme
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  
  // Toggle theme mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        {isMobile ? (
          <MobileLayout>{children}</MobileLayout>
        ) : (
          <MainLayout>{children}</MainLayout>
        )}
      </AppProvider>
    </ThemeProvider>
  );
}
