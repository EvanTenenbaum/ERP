# ERP Project Breadcrumbs

## Project Overview
This document provides a comprehensive overview of the ERP system for a hemp flower wholesale brokerage business. The system is built with Next.js and deployed on Vercel.

## Repository Information
- **GitHub Repository**: https://github.com/EvanTenenbaum/ERP.git
- **Deployment URL**: https://erp-git-main-evan-tenenbaums-projects.vercel.app

## Project Structure
The application follows Next.js App Router conventions:
- `/app`: Main application code
  - `/dashboard`: Dashboard layout and pages
    - `/customers`: Customer management
    - `/inventory`: Inventory management
    - `/sales`: Sales management
    - `/vendors`: Vendor management
    - `/reports`: Reporting functionality
- `/components`: Reusable UI components
  - `/ui`: UI component library using Material UI
    - `/layout`: Layout components (Header, Footer, MainLayout)
- `/lib`: Utility functions and hooks
  - `/context`: Application context providers
  - `/hooks`: Custom React hooks for data management

## UI Framework
The application uses Material UI (MUI) as its UI component library:
- **Installation**: `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`
- **Theme**: Custom theme with light/dark mode support
- **Components**: Comprehensive set of UI components including:
  - Layout components (MainLayout, Header, Footer)
  - Data display components (Table, Card)
  - Form components (Input, Select, Button)
  - Feedback components (Alert, Modal)
  - Navigation components (PageHeader with breadcrumbs)

## Data Management
- The application uses an in-memory database with localStorage persistence
- Data is managed through custom hooks:
  - `useCustomers`: Customer data management
  - `useInventory`: Inventory data management
  - `useSales`: Sales data management
  - `useVendors`: Vendor data management
  - `useReports`: Report generation

## Industry-Specific Requirements
The ERP system includes features specific to hemp flower wholesale brokerage:

1. **Multi-location inventory tracking**
   - Inventory can be tracked across multiple warehouses/locations
   - Each SKU has location information

2. **Payment tracking**
   - Tracks payments to vendors and from customers
   - Applies payments to specific invoices
   - Monitors payment status of all invoices

3. **Customer credit recommendations**
   - Smart algorithm recommends credit limits based on transaction history
   - Balances creditworthiness with revenue potential

4. **Inventory filtering**
   - Filters by price range, category (indoor, outdoor, light dep, etc.)
   - Filters by strain type (indica, sativa, hybrid)
   - Includes vendor code in SKU names

5. **Product image requirements**
   - Allows image upload for each product
   - Associates images with specific SKUs
   - Displays images in inventory views

6. **Vendor and customer coding**
   - Unique codes for all customers and vendors
   - Codes used in SKU names and references

## Recent Work Completed

### UI Improvements
- Implemented Material UI as the component library
- Created a comprehensive set of UI components:
  - MainLayout with responsive navigation
  - Card component for content containers
  - Table component with sorting and pagination
  - Form components (Button, Input, Select)
  - PageHeader with breadcrumbs and actions
- Added a custom theme with light/dark mode support
- Improved mobile responsiveness

### Page Implementations
- Dashboard page with metrics, recent activities, and quick actions
- Inventory management page with filtering and categorization
- Customer management page with customer profiles and search
- Sales management page with order tracking and status management

### Technical Improvements
- Fixed routing issues in the dashboard structure
- Improved component organization
- Enhanced type safety with proper props documentation
- Optimized build process

## Next Steps Planned
1. **UI Enhancements**:
   - Implement data visualization components for reports
   - Add more interactive elements (tooltips, popovers)
   - Enhance accessibility features

2. **Feature Enhancements**:
   - Complete implementation of all CRUD operations
   - Add batch operations for inventory management
   - Implement advanced filtering and search

3. **Technical Improvements**:
   - Implement proper backend database integration
   - Add authentication and authorization
   - Improve error handling and validation
   - Add comprehensive testing

## Getting Started
1. Clone the repository: `git clone https://github.com/EvanTenenbaum/ERP.git`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment
The application is deployed on Vercel and automatically updates when changes are pushed to the main branch.
