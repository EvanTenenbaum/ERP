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

As of April 4, 2025, the ERP system has the following implementation status:

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

8. **Technical Features**
   - Next.js 14.2.26 framework
   - CI/CD pipeline with GitHub Actions
   - Vercel deployment
   - ESLint code quality enforcement
   - Component-based architecture
   - Modular design for extensibility
   - **FIXED**: Import path issues in dashboard components

## Project Structure

```
/
├── app/                         # Next.js app directory (App Router)
│   ├── globals.css              # Global CSS styles
│   ├── layout.js                # Root layout component
│   ├── page.js                  # Home page component
│   └── dashboard/               # Dashboard directory
│       ├── page.js              # Main dashboard with integrated metrics
│       ├── layout.js            # Dashboard layout with AppProvider
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
│   └── ui/                      # UI components
│       └── Button.js            # Button component
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
├── BREADCRUMBS.md               # This file - project documentation and navigation
├── GITHUB_INTEGRATION.md        # GitHub integration and CI/CD pipeline documentation
├── INDUSTRY_REQUIREMENTS.md     # Industry-specific requirements documentation
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── PROJECT_STATUS.md            # Current project status and next steps
├── README.md                    # Project overview and getting started guide
├── tailwind.config.js           # Tailwind CSS configuration
└── vercel.json                  # Vercel deployment configuration
```

## Architecture Overview

The ERP system follows a modular architecture with clear separation of concerns:

1. **UI Layer**: Components in the `components/` directory
   - Form components for data entry
   - UI components for visual elements
   - Page components in the `app/` directory
   - DataLoader component for populating test data

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

The project uses standard Next.js App Router directory structure without route groups. The `app/dashboard` directory contains all the main application modules, and the URL paths include "dashboard" in them (e.g., `/dashboard/inventory`).

### Navigation Implementation

The navigation links in the application are implemented using Next.js `Link` component with paths that include the dashboard prefix:

```jsx
// Correct link implementation
<Link href="/dashboard/inventory" className="btn btn-primary inline-block">
  Explore Inventory
</Link>
```

## Component Structure

### Form Components

The application uses form components for data entry and management:

- `CustomerForm.js`: Form for adding and editing customer information
- `InventoryForm.js`: Form for adding and editing inventory items
- `SalesForm.js`: Form for creating and editing sales
- `VendorForm.js`: Form for adding and editing vendor information
- `ReportExport.js`: Component for exporting reports
- `ReportViewer.js`: Component for viewing reports

### UI Components

The application includes reusable UI components:

- `Button.js`: A customizable button component with various styles and options
- `DataLoader.jsx`: Component for loading dummy data into the application

## Import Paths

When importing components, be careful with the relative paths. The correct import paths for components are:

```jsx
// For importing UI components from dashboard pages
import Button from '../../components/ui/Button';

// For importing hooks from dashboard pages
import { useCustomers } from '../../lib/hooks/useCustomers';

// For importing context from dashboard pages
import { useApp } from '../../lib/context/AppContext';
```

Note that the import paths were recently fixed to ensure proper module resolution.

## Recent Changes and Fixes

As of April 4, 2025, the following changes and fixes have been implemented:

1. **Fixed Features**:
   - Fixed "Manage Locations" page that was previously showing a "Not Found" error
   - Fixed "Add New Customer" form that was previously showing a JavaScript error
   - Fixed import paths in dashboard components to properly resolve modules
   - Fixed hook exports to use named exports instead of default exports

2. **Added Features**:
   - Added comprehensive dummy data for inventory, customers, and sales
   - Added DataLoader component for populating the app with test data
   - Added proper AppProvider wrapper in dashboard layout

3. **Repository Changes**:
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
   - Implement a more modern and consistent design system
   - Add data visualization for key metrics
   - Improve mobile responsiveness

2. **Feature Enhancements**:
   - Implement advanced filtering for inventory
   - Add batch operations for inventory management
   - Enhance reporting capabilities with more visualization options

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

3. **Data Not Showing**:
   - Use the DataLoader component to populate the app with dummy data
   - Check browser console for any JavaScript errors
   - Verify localStorage access if data isn't persisting

## Deployment

The application is deployed on Vercel. To deploy changes:

1. Push changes to the GitHub repository
2. Vercel will automatically deploy the changes
3. Ensure environment variables are properly set in the Vercel dashboard

Current deployment URL: https://erp-git-main-evan-tenenbaums-projects.vercel.app
