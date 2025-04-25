# ERP System Breadcrumbs

This document serves as a comprehensive guide to the Multi-Tenant ERP System project, providing essential information about the project structure, routing configuration, navigation system, and instructions for future development tasks.

## Project Overview

The Multi-Tenant ERP System is a comprehensive solution for hemp flower wholesale brokerage businesses, built with Next.js. It provides modules for:

- Customer Management
- Inventory Management
- Sales Management
- Vendor Management
- Reporting & Analytics
- Multi-Tenant Architecture

## Current Implementation Status

As of April 25, 2025, the ERP system has the following implementation status:

1. **Customer Management**
   - Customer profile creation and management
   - Contact information tracking
   - Sales history and order tracking
   - Payment pattern monitoring
   - Customer segmentation and categorization
   - Custom fields for customer-specific requirements
   - **FIXED**: Add New Customer functionality now working properly
   - **ADDED**: Dummy customer data for testing

2. **Inventory Management**
   - Product catalog with detailed information
   - Multi-location inventory tracking
   - Product images and visual representation
   - Stock level monitoring
   - Inventory valuation
   - Batch/lot tracking for hemp flower products
   - Product categorization and tagging
   - **FIXED**: Manage Locations page now properly implemented
   - **ADDED**: Dummy inventory data for testing

3. **Sales Management**
   - Invoice creation and management
   - Order processing
   - Sales transaction recording
   - Pricing management
   - Discount and promotion handling
   - Sales pipeline visualization
   - Commission tracking
   - **ADDED**: Dummy sales data for testing

4. **Vendor Management**
   - Vendor profile creation and management
   - Purchase order processing
   - Vendor performance tracking
   - Payment scheduling
   - Vendor communication logs
   - Vendor categorization

5. **Reporting & Analytics**
   - Customizable report generation
   - Sales performance analytics
   - Inventory turnover reports
   - Customer behavior analysis
   - Financial reporting
   - Export capabilities (PDF, Excel, CSV)
   - Data visualization with charts and graphs

6. **Multi-Tenant Architecture**
   - Isolated data environments for different customers
   - Tenant-specific customization
   - Shared infrastructure with data separation
   - Tenant administration tools

7. **User Interface & Experience**
   - Responsive, mobile-friendly design
   - Dashboard with key performance indicators
   - Intuitive navigation
   - Role-based access control
   - **ADDED**: Data loader component for populating dummy data
   - **IMPROVED**: Clean, modern UI with consistent styling
   - **ADDED**: Comprehensive set of reusable UI components
   - **FIXED**: Routing issues with duplicate dashboard directories

8. **Technical Features**
   - Next.js 14.2.26 framework
   - CI/CD pipeline with GitHub Actions
   - Vercel deployment
   - ESLint code quality enforcement
   - Component-based architecture
   - Modular design for extensibility
   - **FIXED**: Import path issues in dashboard components
   - **FIXED**: Routing configuration for proper navigation

## Recent UI Improvements

As of April 25, 2025, the following UI improvements have been implemented:

1. **New UI Components**:
   - Header - Responsive navigation header with mobile support
   - Footer - Consistent footer across all pages
   - MainLayout - Layout wrapper for consistent page structure
   - Card - Container for content sections
   - Table - Data display with loading and empty states
   - Badge - Status indicators for various states
   - Input - Form input fields with validation support
   - Select - Dropdown selection component
   - PageHeader - Consistent page headers with actions
   - Alert - Notification messages with different severity levels
   - Modal - Dialog windows for interactions
   - Tabs - Tabbed interface for organizing content
   - Skeleton - Loading state placeholders
   - EmptyState - Empty data state displays

2. **Styling Improvements**:
   - Consistent color scheme with primary color variables
   - Improved typography hierarchy
   - Better spacing and layout
   - Enhanced mobile responsiveness
   - Dark mode support
   - Consistent form styling
   - Improved table styling
   - Better visual hierarchy

3. **Dashboard Improvements**:
   - Redesigned metrics display
   - Enhanced recent activity section
   - Improved inventory alerts
   - Better quick actions layout
   - More intuitive navigation

## Project Structure

```
/
├── app/                         # Next.js app directory (App Router)
│   ├── globals.css              # Global CSS styles (UPDATED)
│   ├── layout.js                # Root layout component
│   ├── page.js                  # Home page component (UPDATED)
│   └── dashboard/               # Dashboard directory (FIXED)
│       ├── page.js              # Main dashboard with integrated metrics (UPDATED)
│       ├── layout.js            # Dashboard layout with AppProvider (UPDATED)
│       ├── customers/           # Customer management module
│       │   ├── page.js          # Customer listing page
│       │   ├── new/             # New customer creation
│       │   │   └── page.js      # Add customer page
│       │   └── [id]/            # Dynamic route for customer details
│       │       └── page.js      # Customer details page
│       ├── inventory/           # Inventory management module
│       │   ├── page.js          # Inventory listing page
│       │   ├── add/             # Add inventory item
│       │   │   └── page.js      # Add product page
│       │   ├── locations/       # Manage inventory locations
│       │   │   └── page.js      # Locations management page
│       │   └── [id]/            # Dynamic route for product details
│       │       └── page.js      # Product details page
│       ├── reports/             # Reporting module
│       │   └── page.js          # Reports page with multiple report types
│       ├── sales/               # Sales management module
│       │   ├── page.js          # Sales listing page
│       │   ├── new/             # New sale creation
│       │   │   └── page.js      # Create sale page
│       │   └── [id]/            # Dynamic route for sale details
│       │       └── page.js      # Sale details page
│       └── vendors/             # Vendor management module
│           ├── page.js          # Vendor listing page
│           └── [id]/            # Dynamic route for vendor details
│               └── page.js      # Vendor details page
├── components/                  # Reusable components
│   ├── DataLoader.jsx           # Component for loading dummy data
│   ├── forms/                   # Form components
│   │   ├── CustomerForm.js      # Customer form component
│   │   ├── InventoryForm.js     # Inventory form component
│   │   ├── ReportExport.js      # Report export component
│   │   ├── ReportViewer.js      # Report viewer component
│   │   ├── SalesForm.js         # Sales form component
│   │   └── VendorForm.js        # Vendor form component
│   └── ui/                      # UI components (NEW)
│       ├── Alert.js             # Alert component (NEW)
│       ├── Badge.js             # Badge component (NEW)
│       ├── Button.js            # Button component (UPDATED)
│       ├── Card.js              # Card component (NEW)
│       ├── EmptyState.js        # Empty state component (NEW)
│       ├── Input.js             # Input component (NEW)
│       ├── Modal.js             # Modal component (NEW)
│       ├── PageHeader.js        # Page header component (NEW)
│       ├── Select.js            # Select component (NEW)
│       ├── Skeleton.js          # Skeleton loading component (NEW)
│       ├── Table.js             # Table component (NEW)
│       ├── Tabs.js              # Tabs component (NEW)
│       └── layout/              # Layout components (NEW)
│           ├── Footer.js        # Footer component (NEW)
│           ├── Header.js        # Header component (NEW)
│           └── MainLayout.js    # Main layout component (NEW)
├── dummy-data/                  # Dummy data for testing
│   ├── customer-data.js         # Customer dummy data
│   ├── data-loader.js           # Data loader utility
│   ├── inventory-data.js        # Inventory dummy data
│   └── sales-data.js            # Sales dummy data
├── lib/                         # Library code and utilities
│   ├── api/                     # API utilities
│   │   ├── customers.js         # Customer API utilities
│   │   ├── inventory.js         # Inventory API utilities
│   │   ├── reports.js           # Reports API utilities
│   │   ├── sales.js             # Sales API utilities
│   │   └── vendors.js           # Vendor API utilities
│   ├── context/                 # React context providers
│   │   └── AppContext.js        # Global application context
│   ├── database/                # Database utilities
│   │   ├── index.js             # Database connection and utilities
│   │   └── schema.js            # Database schema definitions
│   ├── hooks/                   # React hooks
│   │   ├── useCustomers.js      # Customer management hook
│   │   ├── useInventory.js      # Inventory management hook
│   │   ├── useReports.js        # Reports and analytics hook
│   │   ├── useSales.js          # Sales management hook
│   │   └── useVendors.js        # Vendor management hook
│   └── utils/                   # Utility functions
├── BREADCRUMBS.md               # This file - project documentation and navigation (UPDATED)
├── GITHUB_INTEGRATION.md        # GitHub integration and CI/CD pipeline documentation
├── INDUSTRY_REQUIREMENTS.md     # Industry-specific requirements documentation
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── PROJECT_STATUS.md            # Current project status and next steps
├── README.md                    # Project overview and getting started guide
├── tailwind.config.js           # Tailwind CSS configuration (UPDATED)
└── vercel.json                  # Vercel deployment configuration
```

## Architecture Overview

The ERP system follows a modular architecture with clear separation of concerns:

1. **UI Layer**: Components in the `components/` directory
   - Form components for data entry
   - UI components for visual elements
   - Page components in the `app/` directory
   - DataLoader component for populating test data
   - **NEW**: Comprehensive set of reusable UI components

2. **Business Logic Layer**: Hooks and context in the `lib/hooks/` and `lib/context/` directories
   - React hooks for domain-specific logic
   - Context providers for global state management
   - Integration between different modules

3. **Data Access Layer**: API utilities in the `lib/api/` directory
   - CRUD operations for each entity
   - Business logic for data manipulation
   - Integration with database

4. **Database Layer**: Database utilities in the `lib/database/` directory
   - Database connection and configuration
   - Schema definitions
   - Query utilities
   - In-memory database with localStorage persistence

## Integration Points

The system is fully integrated with the following key integration points:

1. **Global Context (AppContext.js)**
   - Provides shared state and functionality across the application
   - Integrates all individual hooks (customers, inventory, sales, vendors, reports)
   - Implements cross-module functionality
   - Now properly wrapped around dashboard components via dashboard/layout.js

2. **Dashboard Integration**
   - Main dashboard displays data from all modules
   - Interactive charts show sales trends, revenue vs. cost, top products, and top customers
   - Low stock alerts from inventory management
   - Recent sales activity from sales management
   - Upcoming vendor payments from vendor management

3. **Sales-Inventory Integration**
   - Creating a sale automatically updates inventory levels
   - Inventory availability is checked during sale creation

4. **Customer-Sales Integration**
   - Customer profiles include sales history
   - Sales metrics are used for customer segmentation and credit recommendations

5. **Vendor-Inventory Integration**
   - Vendor profiles are linked to their products
   - Purchase orders update inventory when received

## Hemp Industry Specific Features

The ERP system includes several features specific to the hemp flower wholesale brokerage industry:

1. **Product Categorization**
   - Categories for hemp products (indoor, outdoor, light dep, concentrate, vape, other)
   - Strain type classification (indica, sativa, hybrid)
   - Batch/lot tracking for regulatory compliance
   - SKUs include vendor codes for easy identification

2. **Multi-Location Inventory**
   - Tracking inventory across multiple physical locations
   - Transfer management between locations
   - Location-specific reporting
   - No reorder points needed as per industry requirements

3. **Vendor Coding System**
   - Unique codes for all vendors
   - Vendor code included in product SKUs
   - Performance tracking metrics specific to hemp suppliers
   - Financial tracking for each vendor

4. **Customer Management**
   - Segmentation based on purchase history and payment patterns
   - Credit recommendations based on customer behavior
   - Custom fields for industry-specific customer requirements
   - Financial tracking for each customer
   - Smart credit recommendations balancing creditworthiness with revenue potential

5. **Payment Tracking**
   - Track payments to vendors and from customers
   - Apply payments to specific open invoices
   - Easy tracking of payment status for all invoices

6. **Inventory Filtering**
   - Filter inventory by price range
   - Filter by category (indoor, outdoor, light dep, concentrate, vape, other)
   - Filter by strain type (indica, sativa, hybrid)

7. **Product Images**
   - Ability to take and store product images
   - Images remain associated with specific SKUs
   - Visual representation in inventory listings

## Routing and Navigation

### Directory Structure

The project uses standard Next.js App Router directory structure. The `app/dashboard` directory contains all the main application modules, and the URL paths include "dashboard" in them (e.g., `/dashboard/inventory`).

**FIXED**: Previously, there were duplicate dashboard directories ('dashboard' and '{dashboard}') causing routing issues. This has been resolved by consolidating into a single dashboard directory.

### Navigation Implementation

The navigation links in the application are implemented using Next.js `Link` component with paths that include the dashboard prefix:

```jsx
// Correct link implementation
<Link href="/dashboard/inventory" className="btn btn-primary inline-block">
  Explore Inventory
</Link>
```

## UI Component System

The application now includes a comprehensive set of reusable UI components:

### Layout Components

- `Header.js`: Responsive navigation header with mobile support
- `Footer.js`: Consistent footer across all pages
- `MainLayout.js`: Layout wrapper for consistent page structure

### Content Components

- `Card.js`: Container for content sections
- `Table.js`: Data display with loading and empty states
- `Badge.js`: Status indicators for various states
- `PageHeader.js`: Consistent page headers with actions
- `Alert.js`: Notification messages with different severity levels
- `Modal.js`: Dialog windows for interactions
- `Tabs.js`: Tabbed interface for organizing content
- `Skeleton.js`: Loading state placeholders
- `EmptyState.js`: Empty data state displays

### Form Components

- `Input.js`: Form input fields with validation support
- `Select.js`: Dropdown selection component
- `Button.js`: Button component with various styles and options

## Styling System

The application uses a consistent styling system based on Tailwind CSS:

1. **Color System**:
   - Primary color palette with 11 shades (50-950)
   - Consistent use of colors for different UI elements
   - Support for dark mode

2. **Typography**:
   - Consistent font sizes and weights
   - Clear hierarchy for headings and body text

3. **Spacing**:
   - Consistent spacing using Tailwind's spacing scale
   - Proper padding and margins for all components

4. **Component Styling**:
   - Consistent styling for all UI components
   - Proper hover and focus states
   - Accessible contrast ratios

## Recent Changes and Fixes

As of April 25, 2025, the following changes and fixes have been implemented:

1. **UI Improvements**:
   - Implemented a clean, modern UI with consistent styling
   - Added a comprehensive set of reusable UI components
   - Improved responsive design for better mobile experience
   - Enhanced visual hierarchy and readability
   - Added proper loading and empty states

2. **Fixed Features**:
   - Fixed routing issues with duplicate dashboard directories
   - Fixed "Manage Locations" page that was previously showing a "Not Found" error
   - Fixed "Add New Customer" form that was previously showing a JavaScript error
   - Fixed import paths in dashboard components to properly resolve modules
   - Fixed hook exports to use named exports instead of default exports

3. **Added Features**:
   - Added comprehensive dummy data for inventory, customers, and sales
   - Added DataLoader component for populating the app with test data
   - Added proper AppProvider wrapper in dashboard layout
   - Added new UI components for consistent design

4. **Repository Changes**:
   - Cleaned up repository to exclude node_modules directory
   - Added proper .gitignore file
   - Organized project structure for better maintainability

## Getting Started for Developers

To continue development on this project:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EvanTenenbaum/ERP.git
   cd ERP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Load dummy data**:
   - Navigate to the dashboard
   - Click the "Load Dummy Data" button in the bottom-right corner
   - Refresh the page to see the populated data

5. **Access key features**:
   - Manage inventory locations: `/dashboard/inventory/locations`
   - Add new customer: `/dashboard/customers/new`
   - Add new product: `/dashboard/inventory/add`
   - Create new sale: `/dashboard/sales/new`

## Next Steps

The following enhancements are planned for future development:

1. **UI Improvements**:
   - Add data visualization for key metrics
   - Implement advanced filtering for inventory
   - Add batch operations for inventory management

2. **Feature Enhancements**:
   - Enhance reporting capabilities with more visualization options
   - Implement customer credit recommendation algorithm
   - Add more product image management features

3. **Technical Improvements**:
   - Implement proper backend database integration
   - Add authentication and authorization
   - Improve error handling and validation

## Troubleshooting

If you encounter issues with the application:

1. **Import Path Errors**:
   - Ensure you're using the correct relative paths as shown in the Import Paths section
   - Remember that dashboard components need to import from the root level (../../)

2. **Component Rendering Issues**:
   - Verify that the AppProvider is properly wrapping components that use the useApp hook
   - Check for null or undefined values in component props

3. **Routing Issues**:
   - Make sure all links use the correct paths with the dashboard prefix
   - Check that dynamic routes are properly configured
   - Verify that page components are in the correct directories
