# ERP Project Handoff Document

## Project Overview
This is a comprehensive handoff document for the Hemp Flower Wholesale Brokerage ERP system built with Next.js and Material UI. This document contains all technical details, implementation specifics, current issues, and recommendations needed to continue development.

## Repository Information
- **GitHub Repository**: https://github.com/EvanTenenbaum/ERP.git
- **Deployment URL**: https://erp-git-main-evan-tenenbaums-projects.vercel.app
- **Latest Commit**: "Implement mobile-first design with one-handed operation focus"

## Technical Stack
- **Frontend Framework**: Next.js 14.2.26
- **UI Library**: Material UI v5 (@mui/material, @emotion/react, @emotion/styled)
- **State Management**: React Context API (AppProvider)
- **Data Storage**: In-memory with localStorage persistence
- **Deployment**: Vercel

## Project Structure
```
/app
  /dashboard             # Main application area
    /customers           # Customer management
    /inventory           # Inventory management
      /add               # Add new inventory item (mobile-optimized)
      /[id]              # Individual inventory item view
      /locations         # Inventory locations management
    /sales               # Sales management
    /vendors             # Vendor management
    /reports             # Reporting functionality
    layout.js            # Dashboard layout wrapper
    page.js              # Dashboard home page
  globals.css            # Global styles
  page.js                # Application entry point

/components
  /forms                 # Form components
    InventoryForm.js     # Original inventory form (desktop-focused)
  /ui                    # UI components
    /layout
      MainLayout.js      # Desktop layout
      MobileLayout.js    # Mobile-optimized layout with bottom navigation
      ResponsiveLayout.js # Responsive layout switcher
    Button.js            # Material UI button wrapper
    Card.js              # Material UI card wrapper
    Table.js             # Material UI table wrapper
    Input.js             # Material UI input wrapper
    Select.js            # Material UI select wrapper
    PageHeader.js        # Page header with breadcrumbs
    Alert.js             # Alert component
    Modal.js             # Modal component
    Tabs.js              # Tabs component
    Badge.js             # Badge component
    EmptyState.js        # Empty state component

/lib
  /context
    AppContext.js        # Application context provider
  /hooks                 # Custom React hooks
    useCustomers.js      # Customer data management
    useInventory.js      # Inventory data management
    useSales.js          # Sales data management
    useVendors.js        # Vendor data management
    useReports.js        # Report generation

/public                  # Static assets

BREADCRUMBS.md           # Project documentation
MOBILE_FIRST_IMPLEMENTATION.md # Mobile-first design documentation
mobile-first-analysis.md # Analysis of mobile requirements
```

## Key Implementation Details

### 1. Material UI Implementation
- **Theme Configuration**: Custom theme in ResponsiveLayout.js with:
  - Primary color: #4CAF50 (green)
  - Secondary color: #8561c5 (purple)
  - Custom typography scales
  - Responsive breakpoints
  - Component style overrides

- **Component Wrappers**: Created wrapper components around Material UI components for consistent styling and props:
  - Button.js: Wraps MUI Button with custom styling
  - Card.js: Wraps MUI Card with consistent padding and elevation
  - Table.js: Wraps MUI Table with pagination and sorting
  - Input.js: Wraps MUI TextField with consistent styling
  - Select.js: Wraps MUI Select with consistent styling

### 2. Mobile-First Design
- **Responsive Layout System**:
  - ResponsiveLayout.js: Switches between MobileLayout and MainLayout based on screen size
  - Uses useMediaQuery hook to detect mobile devices
  - Implements custom theme with mobile-optimized typography and spacing

- **Bottom Navigation**:
  - Implemented in MobileLayout.js
  - Uses MUI BottomNavigation component
  - Includes navigation to Dashboard, Inventory, Customers, and Sales
  - Positioned at bottom of screen for thumb accessibility

- **Speed Dial for Quick Actions**:
  - Implemented in MobileLayout.js
  - Uses MUI SpeedDial component
  - Provides quick access to common actions (Add Product, Add Customer, New Sale, Add Vendor)
  - Positioned at bottom-right for thumb accessibility

- **Step-by-Step Inventory Intake**:
  - Implemented in app/dashboard/inventory/add/page.js
  - Uses react-swipeable-views for swipe navigation between steps
  - Breaks form into 5 logical steps:
    1. Basic Info (Name, SKU)
    2. Category & Details
    3. Pricing & Quantity
    4. Image Capture
    5. Review & Submit
  - Uses MUI MobileStepper for navigation controls
  - Implements floating action button for quick save

- **Mobile-Optimized Listing Pages**:
  - Implemented in:
    - app/dashboard/inventory/page.js
    - app/dashboard/customers/page.js
    - app/dashboard/sales/page.js
  - Uses card-based UI for mobile
  - Implements horizontally scrollable category filters
  - Uses large search fields with voice input capability
  - Adds floating action buttons for primary actions

### 3. Data Management
- **Context API**: AppProvider in lib/context/AppContext.js provides application state
- **Custom Hooks**:
  - useCustomers: Customer data management
  - useInventory: Inventory data management
  - useSales: Sales data management
  - useVendors: Vendor data management
  - useReports: Report generation

- **Data Persistence**: Uses localStorage for data persistence between sessions
- **Data Structure**:
  ```javascript
  // Example inventory item structure
  {
    id: 'INV001', 
    sku: 'VEN001-PH-001', 
    name: 'Purple Haze', 
    category: 'Indoor', 
    strain: 'Sativa', 
    quantity: 25, 
    price: 45.00, 
    costPrice: 30.00,
    location: 'Warehouse A',
    status: 'In Stock',
    vendorId: 'VEN001',
    images: ['image_url'],
    batchNumber: 'BATCH123',
    notes: 'Sample notes',
    unit: 'gram',
    customFields: {}
  }
  ```

## Current Issues and Solutions

### 1. Deployment Failure
- **Issue**: Deployment is failing due to dependency conflicts with react-swipeable-views
- **Error**: react-swipeable-views requires React 15, 16, or 17, but project uses React 18
- **Solutions**:
  1. **Recommended**: Replace react-swipeable-views with a React 18 compatible alternative:
     ```bash
     # Remove react-swipeable-views
     npm uninstall react-swipeable-views
     
     # Install swiper instead
     npm install swiper
     ```
     Then update app/dashboard/inventory/add/page.js to use Swiper instead of SwipeableViews

  2. **Alternative**: Install with legacy peer dependencies flag:
     ```bash
     npm install --legacy-peer-deps
     ```
     This may work for development but could cause issues in production

  3. **Last Resort**: Downgrade React to version 17:
     ```bash
     npm install react@17 react-dom@17
     ```
     This is not recommended as it would require testing all components with React 17

### 2. Missing Backend Integration
- **Issue**: Currently using localStorage for data persistence, which is not suitable for production
- **Solution**: Implement proper backend integration:
  1. Create API routes in Next.js app/api directory
  2. Implement database connection (MongoDB, PostgreSQL, etc.)
  3. Update custom hooks to use API calls instead of localStorage

### 3. Authentication and Authorization
- **Issue**: No authentication or authorization system implemented
- **Solution**: Implement authentication using Next.js Auth.js (formerly NextAuth):
  1. Install dependencies: `npm install next-auth`
  2. Create authentication API routes
  3. Implement login/signup pages
  4. Add protected routes and role-based access control

## Next Steps and Recommendations

### 1. Fix Deployment Issues
- **Priority**: High
- **Tasks**:
  - Replace react-swipeable-views with Swiper
  - Update inventory add page to use Swiper
  - Test build locally: `npm run build`
  - Push changes and verify deployment

### 2. Implement Backend Integration
- **Priority**: High
- **Tasks**:
  - Choose database (MongoDB recommended for flexibility)
  - Create database schema based on current data structures
  - Implement API routes in Next.js
  - Update custom hooks to use API calls
  - Add error handling and loading states

### 3. Add Authentication and Authorization
- **Priority**: High
- **Tasks**:
  - Implement Next.js Auth.js
  - Create login/signup pages
  - Add role-based access control
  - Secure API routes

### 4. Complete Mobile-First Implementation
- **Priority**: Medium
- **Tasks**:
  - Implement mobile-optimized versions of remaining pages:
    - Vendor management
    - Reports
    - Settings
  - Add offline support with service workers
  - Enhance image capture with direct camera integration
  - Add voice input for text fields

### 5. Enhance User Experience
- **Priority**: Medium
- **Tasks**:
  - Add subtle animations for better feedback
  - Implement skeleton loaders for loading states
  - Add comprehensive error handling
  - Implement toast notifications for actions

### 6. Add Testing
- **Priority**: Medium
- **Tasks**:
  - Implement unit tests with Jest
  - Add component tests with React Testing Library
  - Implement end-to-end tests with Cypress
  - Set up CI/CD pipeline

## Industry-Specific Requirements

### 1. Multi-location Inventory Tracking
- Current implementation includes location field for inventory items
- Need to implement proper location management with:
  - Location CRUD operations
  - Inventory transfer between locations
  - Location-specific reporting

### 2. Payment Tracking
- Need to implement payment tracking for:
  - Customer payments with application to specific invoices
  - Vendor payments with application to purchase orders
  - Payment status tracking and reporting

### 3. Customer Credit Recommendations
- Need to implement algorithm for credit recommendations based on:
  - Transaction history
  - Payment patterns
  - Purchase volume
  - Payment timeliness

### 4. Inventory Filtering
- Current implementation includes basic filtering
- Need to enhance with:
  - Advanced filtering by price range
  - Filtering by category (indoor, outdoor, light dep, concentrate, vape, other)
  - Filtering by strain type (indica, sativa, hybrid)
  - Saved filter views

### 5. Product Image Requirements
- Current implementation includes basic image upload
- Need to enhance with:
  - Direct camera access for mobile
  - Multiple images per product
  - Image optimization
  - Image inclusion in price lists and reports

### 6. Vendor and Customer Coding
- Need to implement unique coding system for:
  - Automatic generation of vendor codes
  - Automatic generation of customer codes
  - Inclusion of vendor codes in SKU names
  - Reference system using codes

## Development Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/EvanTenenbaum/ERP.git
   cd ERP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   Note: If you encounter dependency conflicts, use:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment
The application is deployed on Vercel and automatically updates when changes are pushed to the main branch. To fix the current deployment issues:

1. Replace react-swipeable-views with Swiper
2. Push changes to the main branch
3. Vercel will automatically deploy the updated application

## Contact Information
For any questions or clarifications about this handoff document, please contact the project owner.

---

This handoff document provides all the necessary information to continue development of the Hemp Flower Wholesale Brokerage ERP system. It includes technical details, implementation specifics, current issues, and recommendations for next steps.
