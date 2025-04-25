'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  MobileStepper,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  useMediaQuery,
  Fab,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import PageHeader from '../../../../components/ui/PageHeader';
import SwipeableViews from 'react-swipeable-views';

export default function MobileInventoryIntake() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  
  const methods = useForm({
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      category: 'indoor',
      strainType: 'hybrid',
      vendorId: '',
      price: '',
      costPrice: '',
      quantity: '',
      unit: 'gram',
      images: [],
      batchNumber: '',
      notes: '',
    }
  });
  
  const { control, handleSubmit, watch, formState: { errors } } = methods;
  
  const watchCategory = watch('category');
  
  // Steps for the form
  const steps = [
    'Basic Info',
    'Category & Details',
    'Pricing & Quantity',
    'Image',
    'Review'
  ];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  
  const handleImageCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data) => {
    // Add image to the data if available
    if (imagePreview) {
      data.images = [imagePreview];
    }
    
    console.log('Submitting inventory data:', data);
    
    // Redirect to inventory list after submission
    router.push('/dashboard/inventory');
  };
  
  // Render step content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Box sx={{ p: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Product name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    sx: { height: 56 } // Larger touch target
                  }}
                />
              )}
            />
            
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SKU (Optional)"
                  fullWidth
                  margin="normal"
                  placeholder="Auto-generated if left blank"
                  InputProps={{
                    sx: { height: 56 } // Larger touch target
                  }}
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (Optional)"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
              )}
            />
          </Box>
        );
        
      case 1: // Category & Details
        return (
          <Box sx={{ p: 2 }}>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    label="Category"
                    sx={{ height: 56 }} // Larger touch target
                  >
                    <MenuItem value="indoor">Indoor</MenuItem>
                    <MenuItem value="outdoor">Outdoor</MenuItem>
                    <MenuItem value="light_dep">Light Dep</MenuItem>
                    <MenuItem value="concentrate">Concentrate</MenuItem>
                    <MenuItem value="vape">Vape</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            
            {(watchCategory === 'indoor' || watchCategory === 'outdoor' || watchCategory === 'light_dep') && (
              <Controller
                name="strainType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Strain Type</InputLabel>
                    <Select
                      {...field}
                      label="Strain Type"
                      sx={{ height: 56 }} // Larger touch target
                    >
                      <MenuItem value="indica">Indica</MenuItem>
                      <MenuItem value="sativa">Sativa</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            )}
            
            <Controller
              name="vendorId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vendor (Optional)</InputLabel>
                  <Select
                    {...field}
                    label="Vendor (Optional)"
                    sx={{ height: 56 }} // Larger touch target
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                    <MenuItem value="vendor3">Vendor 3</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            
            <Controller
              name="batchNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Batch/Lot Number (Optional)"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    sx: { height: 56 } // Larger touch target
                  }}
                />
              )}
            />
          </Box>
        );
        
      case 2: // Pricing & Quantity
        return (
          <Box sx={{ p: 2 }}>
            <Controller
              name="price"
              control={control}
              rules={{ 
                required: 'Price is required',
                min: { value: 0, message: 'Price cannot be negative' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price ($)"
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { height: 56 } // Larger touch target
                  }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
            
            <Controller
              name="costPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cost Price ($) (Optional)"
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { height: 56 } // Larger touch target
                  }}
                />
              )}
            />
            
            <Controller
              name="quantity"
              control={control}
              rules={{ 
                min: { value: 0, message: 'Quantity cannot be negative' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantity"
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{
                    sx: { height: 56 } // Larger touch target
                  }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              )}
            />
            
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    {...field}
                    label="Unit"
                    sx={{ height: 56 }} // Larger touch target
                  >
                    <MenuItem value="gram">Gram</MenuItem>
                    <MenuItem value="eighth">Eighth (3.5g)</MenuItem>
                    <MenuItem value="quarter">Quarter (7g)</MenuItem>
                    <MenuItem value="half">Half Ounce (14g)</MenuItem>
                    <MenuItem value="ounce">Ounce (28g)</MenuItem>
                    <MenuItem value="pound">Pound (16oz)</MenuItem>
                    <MenuItem value="unit">Unit</MenuItem>
                    <MenuItem value="cartridge">Cartridge</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        );
        
      case 3: // Image
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Product Image
            </Typography>
            
            {imagePreview ? (
              <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
                <IconButton
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }
                  }}
                  onClick={() => setImagePreview(null)}
                >
                  <KeyboardArrowLeft />
                </IconButton>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '300px', 
                  border: '2px dashed', 
                  borderColor: 'divider',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No image selected
                </Typography>
              </Box>
            )}
            
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <input
                accept="image/*"
                id="icon-button-file"
                type="file"
                capture="environment"
                onChange={handleImageCapture}
                style={{ display: 'none' }}
              />
              <label htmlFor="icon-button-file" style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<AddAPhotoIcon />}
                  fullWidth
                  size="large"
                  sx={{ height: 56 }} // Larger touch target
                >
                  {imagePreview ? 'Change Image' : 'Take Photo'}
                </Button>
              </label>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Tip: Hold your device horizontally for better product photos
            </Typography>
          </Box>
        );
        
      case 4: // Review
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Product Details
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {watch('name') || 'Unnamed Product'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  SKU: {watch('sku') || 'Auto-generated'}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">
                    Category:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {watch('category')?.charAt(0).toUpperCase() + watch('category')?.slice(1) || 'Not specified'}
                  </Typography>
                </Box>
                
                {(watchCategory === 'indoor' || watchCategory === 'outdoor' || watchCategory === 'light_dep') && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      Strain Type:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {watch('strainType')?.charAt(0).toUpperCase() + watch('strainType')?.slice(1) || 'Not specified'}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Price:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${watch('price') || '0.00'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Quantity:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {watch('quantity') || '0'} {watch('unit') || 'units'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            {imagePreview && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '150px', 
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please review the information above before submitting. You can go back to make changes if needed.
            </Typography>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Box sx={{ pb: 7 }}> {/* Add padding at bottom for FAB */}
      <PageHeader 
        title="Add Product"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Inventory', href: '/dashboard/inventory' },
          { label: 'Add Product', href: '/dashboard/inventory/add' },
        ]}
      />
      
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Desktop stepper (hidden on mobile) */}
        {!isMobile && (
          <Stepper activeStep={activeStep} sx={{ p: 3, display: { xs: 'none', sm: 'flex' } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        
        {/* Mobile stepper (text only) */}
        {isMobile && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Step {activeStep + 1}: {steps[activeStep]}
            </Typography>
          </Box>
        )}
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {steps.map((label, index) => (
                <div key={label} style={{ padding: 0 }}>
                  {Math.abs(activeStep - index) <= 2 ? getStepContent(index) : null}
                </div>
              ))}
            </SwipeableViews>
            
            {/* Mobile stepper controls */}
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={activeStep}
              sx={{ 
                mt: 2,
                borderTop: 1,
                borderColor: 'divider',
                '& .MuiMobileStepper-dot': {
                  width: 12,
                  height: 12,
                  mx: 0.5
                }
              }}
              nextButton={
                activeStep === steps.length - 1 ? (
                  <Button 
                    size="large"
                    onClick={handleSubmit(onSubmit)}
                    sx={{ height: 56, px: 3 }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    size="large"
                    onClick={handleNext}
                    sx={{ height: 56, px: 3 }}
                  >
                    Next
                    <KeyboardArrowRight />
                  </Button>
                )
              }
              backButton={
                <Button 
                  size="large" 
                  onClick={handleBack} 
                  disabled={activeStep === 0}
                  sx={{ height: 56, px: 3 }}
                >
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </form>
        </FormProvider>
      </Paper>
      
      {/* Floating Action Button for quick save (mobile only) */}
      {isMobile && activeStep === steps.length - 1 && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
          onClick={handleSubmit(onSubmit)}
        >
          <SaveIcon />
        </Fab>
      )}
      
      {/* Back button for mobile */}
      {isMobile && (
        <Fab
          size="medium"
          color="default"
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000
          }}
          onClick={() => router.push('/dashboard/inventory')}
        >
          <ArrowBackIcon />
        </Fab>
      )}
    </Box>
  );
}
