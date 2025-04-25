'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card as MuiCard, 
  CardContent, 
  CardActionArea,
  Fab,
  IconButton,
  useMediaQuery,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PageHeader from '../../../components/ui/PageHeader';
import { useRouter } from 'next/navigation';

export default function MobileInventoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Sample inventory data
  const inventoryData = [
    { 
      id: 'INV001', 
      sku: 'VEN001-PH-001', 
      name: 'Purple Haze', 
      category: 'Indoor', 
      strain: 'Sativa', 
      quantity: 25, 
      price: 45.00, 
      location: 'Warehouse A',
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'INV002', 
      sku: 'VEN002-OGK-001', 
      name: 'OG Kush', 
      category: 'Indoor', 
      strain: 'Indica', 
      quantity: 5, 
      price: 50.00, 
      location: 'Warehouse B',
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1603909223358-9c951e8a1c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'INV003', 
      sku: 'VEN003-BD-002', 
      name: 'Blue Dream', 
      category: 'Light Dep', 
      strain: 'Hybrid', 
      quantity: 18, 
      price: 40.00, 
      location: 'Warehouse A',
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1603909223398-824ee782b1ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'INV004', 
      sku: 'VEN001-SD-003', 
      name: 'Sour Diesel', 
      category: 'Outdoor', 
      strain: 'Sativa', 
      quantity: 30, 
      price: 35.00, 
      location: 'Warehouse C',
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1603909223467-91cf7e986d69?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'INV005', 
      sku: 'VEN004-GG-001', 
      name: 'Gorilla Glue', 
      category: 'Indoor', 
      strain: 'Hybrid', 
      quantity: 12, 
      price: 48.00, 
      location: 'Warehouse A',
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1603909223361-a5a2d7071f72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ];
  
  // Filter data based on search query
  const filteredData = inventoryData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Categories for quick filtering
  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Indoor', value: 'indoor' },
    { label: 'Outdoor', value: 'outdoor' },
    { label: 'Light Dep', value: 'light_dep' },
  ];
  
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  // Filter by selected category
  const categoryFilteredData = selectedCategory === 'all' 
    ? filteredData 
    : filteredData.filter(item => item.category.toLowerCase() === selectedCategory);
  
  return (
    <Box sx={{ pb: isMobile ? 8 : 3 }}>
      <PageHeader 
        title="Inventory"
        description={isMobile ? undefined : "Manage your hemp flower inventory"}
        breadcrumbs={!isMobile ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Inventory', href: '/dashboard/inventory' },
        ] : undefined}
      />
      
      {/* Search and filter section */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { 
              height: isMobile ? 56 : 'auto',
              borderRadius: 28,
              pl: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: 28,
              }
            }
          }}
          variant="outlined"
          size={isMobile ? "medium" : "small"}
        />
      </Box>
      
      {/* Category chips for quick filtering - scrollable horizontally */}
      <Box 
        sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          pb: 1,
          mb: 2,
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category.value}
            label={category.label}
            onClick={() => handleCategorySelect(category.value)}
            color={selectedCategory === category.value ? "primary" : "default"}
            variant={selectedCategory === category.value ? "filled" : "outlined"}
            sx={{ 
              mr: 1, 
              height: 40, 
              borderRadius: 20,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        ))}
      </Box>
      
      {/* Mobile inventory cards */}
      {isMobile ? (
        <List sx={{ p: 0 }}>
          {categoryFilteredData.map((item) => (
            <MuiCard 
              key={item.id} 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <CardActionArea 
                onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Box sx={{ display: 'flex', p: 0 }}>
                  {/* Product image */}
                  <Box 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* Product details */}
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div" noWrap>
                        {item.name}
                      </Typography>
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color={item.status === 'In Stock' ? 'success' : 'error'} 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.sku}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={item.strain} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>
              </CardActionArea>
            </MuiCard>
          ))}
        </List>
      ) : (
        // Desktop table-like view
        <Grid container spacing={3}>
          {categoryFilteredData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <MuiCard sx={{ height: '100%', borderRadius: 2 }}>
                <CardActionArea onClick={() => router.push(`/dashboard/inventory/${item.id}`)}>
                  <Box 
                    sx={{ 
                      height: 140, 
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    <Chip 
                      label={item.status} 
                      size="small" 
                      color={item.status === 'In Stock' ? 'success' : 'error'} 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        backgroundColor: item.status === 'In Stock' ? 'rgba(46, 125, 50, 0.85)' : 'rgba(211, 47, 47, 0.85)',
                        color: 'white'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.sku}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={item.strain} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="body2">
                        Qty: {item.quantity}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </MuiCard>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Floating action button for adding new product (mobile only) */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 80, // Position above bottom navigation
            right: 16,
            zIndex: 999
          }}
          onClick={() => router.push('/dashboard/inventory/add')}
        >
          <AddIcon />
        </Fab>
      )}
      
      {/* Desktop add button */}
      {!isMobile && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 3 }}
          onClick={() => router.push('/dashboard/inventory/add')}
        >
          Add Product
        </Button>
      )}
    </Box>
  );
}
