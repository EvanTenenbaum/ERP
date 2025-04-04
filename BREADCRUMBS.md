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

As of April 3, 2025, the ERP system has been fully implemented with all core feature sets:

1. **Customer Management**
   - Customer profile creation and management
   - Contact information tracking
   - Sales history and order tracking
   - Payment pattern monitoring
   - Customer segmentation and categorization
   - Custom fields for customer-specific requirements

2. **Inventory Management**
   - Product catalog with detailed information
   - Multi-location inventory tracking
   - Product images and visual representation
   - Stock level monitoring and alerts
   - Inventory valuation
   - Batch/lot tracking for hemp flower products
   - Product categorization and tagging

3. **Sales Management**
   - Invoice creation and management
   - Order processing
   - Sales transaction recording
   - Pricing management
   - Discount and promotion handling
   - Sales pipeline visualization
   - Commission tracking

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
   - Dark/light mode support
   - Dashboard with key performance indicators
   - Intuitive navigation
   - Role-based access control

8. **Technical Features**
   - Next.js 14.2.26 framework
   - CI/CD pipeline with GitHub Actions
   - Vercel deployment
   - ESLint code quality enforcement
   - Component-based architecture
   - Modular design for extensibility

## Project Structure

```
/
├── app/                         # Next.js app directory (App Router)
│   ├── globals.css              # Global CSS styles
│   ├── layout.js                # Root layout component
│   ├── page.js                  # Home page component
│   └── dashboard/               # Dashboard directory
│       ├── page.js              # Main dashboard with integrated metrics
│       ├── customers/           # Customer management module
│       │   ├── page.js          # Customer listing page
│       │   └── [id]/            # Dynamic route for customer details
│       │       └── page.js      # Customer details page
│       ├── inventory/           # Inventory management module
│       │   ├── page.js          # Inventory listing page
│       │   └── [id]/            # Dynamic route for product details
│       │       └── page.js      # Product details page
│       ├── reports/             # Reporting module
│       │   └── page.js          # Reports page with multiple report types
│       ├── sales/               # Sales management module
│       │   ├── page.js          # Sales listing page
│       │   └── [id]/            # Dynamic route for sale details
│       │       └── page.js      # Sale details page
│       └── vendors/             # Vendor management module
│           ├── page.js          # Vendor listing page
│           └── [id]/            # Dynamic route for vendor details
│               └── page.js      # Vendor details page
├── components/                  # Reusable components
│   ├── forms/                   # Form components
│   │   ├── CustomerForm.js      # Customer form component
│   │   ├── InventoryForm.js     # Inventory form component
│   │   ├── SalesForm.js         # Sales form component
│   │   └── VendorForm.js        # Vendor form component
│   └── ui/                      # UI components
│       └── Button.js            # Button component
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

## Integration Points

The system is fully integrated with the following key integration points:

1. **Global Context (AppContext.js)**
   - Provides shared state and functionality across the application
   - Integrates all individual hooks (customers, inventory, sales, vendors, reports)
   - Implements cross-module functionality

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

2. **Multi-Location Inventory**
   - Tracking inventory across multiple physical locations
   - Transfer management between locations
   - Location-specific reporting

3. **Vendor Coding System**
   - Unique codes for all vendors
   - Vendor code included in product SKUs
   - Performance tracking metrics specific to hemp suppliers

4. **Customer Segmentation**
   - Segmentation based on purchase history and payment patterns
   - Credit recommendations based on customer behavior
   - Custom fields for industry-specific customer requirements

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

### UI Components

The application includes reusable UI components:

- `Button.js`: A customizable button component with various styles and options

## Import Paths

When importing components, be careful with the relative paths. The correct import paths for components are:

```jsx
// For importing UI components from form components
import Button from '../ui/Button';

// For importing UI components from pages
import Button from '../../components/ui/Button';

// For importing hooks
import { useCustomers } from '../../../lib/hooks/useCustomers';

// For importing context
import { useApp } from '../../../lib/context/AppContext';
```

## Industry-Specific Requirements

The ERP system is designed for hemp flower wholesale brokerage businesses with specific industry requirements. These requirements are documented in detail in the [INDUSTRY_REQUIREMENTS.md](./INDUSTRY_REQUIREMENTS.md) file, which covers:

- Business scale and operations
- Inventory management with multi-location tracking
- Product categorization and images
- Customer and vendor coding systems
- Credit management
- Payment tracking
- Invoice generation
- Reporting and metrics
- User interface requirements

## Deployment

The application is deployed using Vercel through GitHub integration. The deployment process includes:

1. **GitHub Integration**
   - Automatic deployments from the main branch
   - Preview deployments for pull requests
   - Environment variable management through Vercel

2. **Environment Variables**
   - Database connection strings
   - API keys and secrets
   - Feature flags

3. **CI/CD Pipeline**
   - Automated testing before deployment
   - Code quality checks with ESLint
   - Build optimization

## Instructions for Future Tasks

### Updating BREADCRUMBS.md

For all future tasks related to this ERP project, follow these steps:

1. **Always read BREADCRUMBS.md first** to understand the project structure and recent changes
2. **Update BREADCRUMBS.md after completing any task** that:
   - Changes the project structure
   - Modifies routing or navigation
   - Adds new components or features
   - Fixes significant issues
3. **Document your changes** in the appropriate section of BREADCRUMBS.md
4. **Add a new section** if your changes don't fit into existing sections
5. **Update the "Recent Changes" section** with a brief description of your changes and the date

### Recent Changes Section

Add a new entry to this section whenever you make significant changes to the project:

#### Recent Changes

- **April 3, 2025**: Implemented all core feature sets (customer, inventory, sales, vendor, reporting)
- **April 3, 2025**: Integrated all components with global context provider (AppContext.js)
- **April 3, 2025**: Implemented comprehensive dashboard with data from all modules
- **April 3, 2025**: Deployed application to Vercel with GitHub integration
- **April 3, 2025**: Updated BREADCRUMBS.md with current implementation status and architecture overview
- **April 3, 2025**: Restructured app directory to eliminate route groups with curly braces, fixing navigation issues
- **April 3, 2025**: Created INDUSTRY_REQUIREMENTS.md documenting hemp flower wholesale brokerage specific requirements
- **April 3, 2025**: Updated navigation links to use paths with dashboard prefix
- **April 3, 2025**: Created BREADCRUMBS.md file with comprehensive project documentation

### Directory Structure Best Practices

When working with the Next.js app directory:

1. **Use standard directories**: Avoid using route groups with curly braces to prevent navigation issues
2. **Use consistent naming**: Follow the established naming conventions for directories and files
3. **Maintain proper nesting**: Keep related routes properly nested under their parent directories
4. **Be consistent with imports**: Pay attention to relative paths when importing components

### Component Development

When developing new components:

1. **Follow existing patterns**: Use the same structure and naming conventions as existing components
2. **Place components in appropriate directories**: UI components in `components/ui`, form components in `components/forms`
3. **Use proper import paths**: Be careful with relative paths when importing components
4. **Document component props**: Include JSDoc comments for component props

## Common Issues and Solutions

### Navigation Issues

If links are not working correctly:

1. **Check link paths**: Ensure they include the correct directory structure (e.g., `/dashboard/inventory`)
2. **Verify directory structure**: Confirm directories are using standard naming without curly braces
3. **Clear browser cache**: Sometimes cached pages can cause routing issues

### Import Errors

If you encounter import errors:

1. **Check relative paths**: Ensure the path correctly reflects the component's location
2. **Verify file exists**: Confirm the imported file exists at the specified path
3. **Check for typos**: Ensure the component name and path are spelled correctly

### Database Integration

If you encounter database issues:

1. **Check connection strings**: Verify the database connection strings in environment variables
2. **Verify schema**: Ensure the database schema matches the expected structure
3. **Check error logs**: Database errors are logged in the console and server logs

## Pending Features and Known Issues

### Pending Features

1. **Advanced User Management**
   - User roles and permissions
   - User activity logging
   - Multi-factor authentication

2. **Mobile Application**
   - Native mobile app for field operations
   - Offline capability
   - Barcode/QR code scanning

3. **Advanced Analytics**
   - Predictive analytics for inventory management
   - Customer behavior prediction
   - Market trend analysis

### Known Issues

1. **Performance Optimization**
   - Large datasets may cause performance issues in reporting
   - Solution: Implement pagination and data chunking

2. **Browser Compatibility**
   - Some features may not work in older browsers
   - Solution: Add polyfills and fallbacks

3. **Image Handling**
   - Large product images may cause storage issues
   - Solution: Implement image compression and CDN integration

## Conclusion

This BREADCRUMBS.md file serves as a comprehensive guide to the Multi-Tenant ERP System project. It reflects the current state of the project as of April 3, 2025, with all core feature sets implemented and integrated. It should be updated regularly to provide guidance for future development tasks.
