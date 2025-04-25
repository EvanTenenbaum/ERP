# Backend Implementation Plan for Hemp Flower Wholesale ERP

## Overview

This document outlines the comprehensive backend implementation plan for the Hemp Flower Wholesale ERP system. It integrates the database schema, API endpoints, and authentication strategy into a cohesive implementation roadmap.

## Current System Analysis

The current system is a Next.js application with the following characteristics:

- Frontend built with Next.js 14.2.26 and Material UI v5
- Mobile-first design optimized for one-handed operation
- Data persistence using localStorage without a proper backend
- No authentication system implemented
- Deployment on Vercel

The system uses React Context API for state management with hooks for different entities:
- useCustomers
- useInventory
- useSales
- useVendors
- useReports

## Implementation Roadmap

### Phase 1: Database Setup and Configuration

#### 1.1 Set Up PostgreSQL Database

1. Create a PostgreSQL database instance
   - Option 1: Use a managed service like Vercel Postgres, Supabase, or Railway
   - Option 2: Self-host on a cloud provider like AWS RDS or DigitalOcean

2. Configure database connection
   - Set up environment variables for database connection
   - Create a database connection utility

#### 1.2 Install and Configure Prisma ORM

1. Install Prisma packages
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. Create Prisma schema based on the database schema design
   - Define models for all entities (Tenant, User, Customer, Product, etc.)
   - Define relationships between models
   - Add indexes for performance optimization

3. Generate Prisma client
   ```bash
   npx prisma generate
   ```

4. Create database migration
   ```bash
   npx prisma migrate dev --name init
   ```

#### 1.3 Create Database Utility Functions

1. Create a Prisma client instance
   ```javascript
   // lib/prisma.js
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = global as unknown as { prisma: PrismaClient };

   export const prisma = globalForPrisma.prisma || new PrismaClient();

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

2. Create database seeding scripts for development
   - Create seed data for tenants, users, customers, products, etc.
   - Implement a seeding script using Prisma

### Phase 2: Authentication Implementation

#### 2.1 Install and Configure NextAuth.js

1. Install required packages
   ```bash
   npm install next-auth@latest @next-auth/prisma-adapter bcrypt
   ```

2. Configure NextAuth.js as outlined in the authentication strategy document
   - Set up credentials provider
   - Configure callbacks for JWT and session
   - Set up Prisma adapter

3. Create API routes for authentication
   - Implement `/api/auth/[...nextauth]` route
   - Create login, logout, and session endpoints

#### 2.2 Implement User Management

1. Create API routes for user management
   - Implement CRUD operations for users
   - Add password reset functionality
   - Implement email verification (optional)

2. Implement role-based access control
   - Define roles and permissions
   - Create middleware for permission checking
   - Apply permission checks to API routes

#### 2.3 Create Authentication UI

1. Create login page
   - Implement tenant selection
   - Add email and password fields
   - Handle authentication errors

2. Create user management pages
   - Implement user creation form
   - Add user editing functionality
   - Create password reset pages

### Phase 3: API Implementation

#### 3.1 Create Base API Structure

1. Set up API route structure
   - Organize routes by resource
   - Create base controller classes
   - Implement error handling middleware
   - Set up reporting and analytics API structure

2. Implement authentication middleware
   - Create middleware for API route protection
   - Add tenant isolation to all data access
   - Implement rate limiting

#### 3.2 Implement Customer API

1. Create customer API routes
   - Implement CRUD operations
   - Add filtering and pagination
   - Create endpoints for customer metrics and analysis

2. Update customer hook to use API
   - Modify useCustomers hook to call API endpoints
   - Update state management to handle API responses
   - Add error handling

#### 3.3 Implement Inventory API

1. Create product API routes
   - Implement CRUD operations
   - Add filtering by category, strain type, price range
   - Create endpoints for product search

2. Create location API routes
   - Implement CRUD operations
   - Add endpoints for location inventory

3. Create inventory management API routes
   - Implement add, remove, transfer operations
   - Create endpoints for inventory reporting

4. Update inventory hook to use API
   - Modify useInventory hook to call API endpoints
   - Update state management to handle API responses
   - Add error handling

#### 3.4 Implement Sales API

1. Create sales API routes
   - Implement CRUD operations
   - Add filtering and pagination
   - Create endpoints for sales reporting

2. Create sale item API routes
   - Implement CRUD operations
   - Add endpoints for item management

3. Update sales hook to use API
   - Modify useSales hook to call API endpoints
   - Update state management to handle API responses
   - Add error handling

#### 3.5 Implement Vendor API

1. Create vendor API routes
   - Implement CRUD operations
   - Add filtering and pagination
   - Create endpoints for vendor metrics and analysis

2. Create purchase order API routes
   - Implement CRUD operations
   - Add endpoints for purchase order management

3. Update vendor hook to use API
   - Modify useVendors hook to call API endpoints
   - Update state management to handle API responses
   - Add error handling

#### 3.6 Implement Payment API

1. Create payment API routes
   - Implement CRUD operations
   - Add endpoints for payment processing
   - Create endpoints for payment reporting

2. Integrate payment functionality with sales and purchase orders
   - Add payment processing to sales
   - Add payment processing to purchase orders

#### 3.7 Implement Reporting API

1. Create reporting API routes
   - Implement sales reporting endpoints
   - Add financial reporting endpoints
   - Create inventory reporting endpoints
   - Implement report definition management endpoints
   - Add report execution endpoints
   - Create dashboard management endpoints
   - Implement report scheduling endpoints
   - Add analytics endpoints

2. Update reports hook to use API
   - Modify useReports hook to call API endpoints
   - Update state management to handle API responses
   - Add error handling
   - Implement report builder functionality
   - Add dashboard builder functionality

### Phase 4: File Storage Implementation

#### 4.1 Set Up Cloud Storage

1. Choose a cloud storage provider
   - Option 1: AWS S3
   - Option 2: Cloudinary
   - Option 3: Vercel Blob Storage

2. Configure storage client
   - Set up environment variables
   - Create storage utility functions

#### 4.2 Implement File Upload API

1. Create file upload API routes
   - Implement product image upload
   - Add document upload for sales and purchase orders
   - Create endpoints for file management

2. Integrate file upload with frontend
   - Add file upload components
   - Update forms to handle file uploads
   - Add image preview functionality

### Phase 5: Integration and Testing

#### 5.1 Update Frontend to Use Backend

1. Update AppContext to use authentication
   - Integrate NextAuth.js session management
   - Update state management to handle authentication
   - Add loading states for API calls

2. Update all hooks to use API endpoints
   - Ensure all hooks call the appropriate API endpoints
   - Add error handling and loading states
   - Update state management to handle API responses

3. Update UI components to handle authentication
   - Add login/logout functionality
   - Update navigation to show/hide based on permissions
   - Add loading indicators

#### 5.2 Implement Data Migration

1. Create data migration utility
   - Implement export functionality for localStorage data
   - Create import functionality for database
   - Add validation and error handling

2. Test migration process
   - Verify data integrity after migration
   - Check relationships between entities
   - Ensure all functionality works with migrated data

#### 5.3 Comprehensive Testing

1. Unit testing
   - Test API endpoints
   - Test authentication
   - Test database operations

2. Integration testing
   - Test end-to-end workflows
   - Verify frontend-backend integration
   - Test multi-tenant isolation

3. Performance testing
   - Test API response times
   - Verify database query performance
   - Check frontend rendering performance

### Phase 6: Deployment and Documentation

#### 6.1 Set Up Production Environment

1. Configure production database
   - Set up connection pooling
   - Configure backups
   - Implement monitoring

2. Set up environment variables
   - Configure authentication secrets
   - Set up database connection
   - Add API keys for third-party services

3. Configure deployment pipeline
   - Set up CI/CD with GitHub Actions
   - Configure Vercel deployment
   - Add database migration to deployment process

#### 6.2 Create Documentation

1. API documentation
   - Generate OpenAPI specification
   - Create API reference documentation
   - Add usage examples

2. Developer documentation
   - Document codebase structure
   - Add setup instructions
   - Create contribution guidelines

3. User documentation
   - Create user guides
   - Add feature documentation
   - Create troubleshooting guides

## Technical Implementation Details

### Database Implementation

The database will be implemented using PostgreSQL with Prisma ORM. The schema will include the following models:

- Tenant
- User
- Customer
- Vendor
- Product
- Location
- InventoryRecord
- InventoryImage
- Sale
- SaleItem
- PurchaseOrder
- POItem
- Payment

Refer to the database schema document for detailed model definitions and relationships.

### API Implementation

The API will be implemented using Next.js API routes with the following structure:

```
/app/api/
  /auth/
    /[...nextauth]/route.js
    /password/
      /reset/route.js
      /update/route.js
  /customers/
    /route.js
    /[id]/route.js
    /[id]/metrics/route.js
    /[id]/sales-history/route.js
    /[id]/credit-recommendation/route.js
    /segments/route.js
  /products/
    /route.js
    /[id]/route.js
    /search/route.js
    /category/[category]/route.js
    /strain-type/[type]/route.js
    /price-range/route.js
    /vendor/[vendorId]/route.js
    /low-inventory/route.js
    /[id]/images/route.js
    /[id]/images/[imageId]/route.js
  /locations/
    /route.js
    /[id]/route.js
  /inventory/
    /route.js
    /product/[productId]/route.js
    /location/[locationId]/route.js
    /add/route.js
    /remove/route.js
    /transfer/route.js
  /sales/
    /route.js
    /[id]/route.js
    /customer/[customerId]/route.js
    /[id]/items/route.js
    /[id]/items/[itemId]/route.js
  /vendors/
    /route.js
    /[id]/route.js
    /[id]/metrics/route.js
    /[id]/purchase-orders/route.js
    /[id]/performance/route.js
  /purchase-orders/
    /route.js
    /[id]/route.js
    /vendor/[vendorId]/route.js
    /[id]/items/route.js
    /[id]/items/[itemId]/route.js
  /payments/
    /route.js
    /[id]/route.js
    /entity/[entityType]/[entityId]/route.js
    /process-sale-payment/route.js
    /process-purchase-order-payment/route.js
  /reports/
    /sales/route.js
    /sales/by-customer/route.js
    /sales/by-product/route.js
    /financial/route.js
    /financial/accounts-receivable/route.js
    /financial/accounts-payable/route.js
    /inventory/current-levels/route.js
    /inventory/movement/route.js
    /inventory/valuation/route.js
  /dashboard/
    /summary/route.js
    /recent-sales/route.js
    /upcoming-payments/route.js
    /low-stock-products/route.js
  /upload/
    /image/route.js
    /document/route.js
```

Each API route will follow a consistent pattern:
1. Authenticate the request
2. Validate input data
3. Perform database operations
4. Return appropriate response

### Authentication Implementation

Authentication will be implemented using NextAuth.js with a credentials provider. The implementation will include:

- JWT-based session management
- Role-based access control
- Multi-tenant support
- Password hashing with bcrypt
- Password reset functionality

Refer to the authentication strategy document for detailed implementation.

### Frontend Integration

The frontend will be updated to use the new backend through:

1. Updating the AppContext to use NextAuth.js for authentication
2. Modifying all hooks to call API endpoints instead of using localStorage
3. Adding loading states and error handling for API calls
4. Implementing proper authentication UI (login, logout, user management)

## Development Workflow

The development workflow will follow these steps:

1. Set up the development environment
   - Install dependencies
   - Configure environment variables
   - Set up database

2. Implement features in order of priority
   - Start with authentication
   - Implement core API endpoints
   - Update frontend to use API
   - Add advanced features

3. Test thoroughly
   - Unit tests for API endpoints
   - Integration tests for workflows
   - Manual testing of UI

4. Deploy to production
   - Configure production environment
   - Run database migrations
   - Deploy application

## Timeline and Milestones

The implementation is estimated to take 8-10 weeks, with the following milestones:

1. **Week 1-2**: Database setup and authentication implementation
2. **Week 3-4**: Core API implementation (customers, inventory, sales)
3. **Week 5-6**: Additional API implementation (vendors, payments, reports)
4. **Week 7-8**: Frontend integration and testing
5. **Week 9-10**: Deployment, documentation, and final testing

## Risks and Mitigation

### Data Migration Risks

**Risk**: Loss of data during migration from localStorage to database
**Mitigation**: 
- Create comprehensive backup of localStorage data before migration
- Implement validation checks during migration
- Allow parallel operation of both systems during transition

### Performance Risks

**Risk**: Poor performance with large datasets
**Mitigation**:
- Implement database indexing
- Use pagination for large data sets
- Optimize database queries
- Implement caching where appropriate

### Security Risks

**Risk**: Unauthorized access to sensitive data
**Mitigation**:
- Implement robust authentication
- Enforce tenant isolation
- Apply principle of least privilege
- Regular security audits

## Conclusion

This backend implementation plan provides a comprehensive roadmap for transitioning the Hemp Flower Wholesale ERP system from a localStorage-based application to a full-featured backend with proper database storage, API endpoints, and authentication. By following this plan, the development team can implement a robust, scalable, and secure backend that meets all the requirements of the hemp flower wholesale brokerage industry.
