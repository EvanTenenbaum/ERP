# Database Schema Design for Hemp Flower Wholesale ERP

## Overview
This document outlines the proposed database schema for the Hemp Flower Wholesale ERP system. The schema is designed to support all the requirements identified in the industry requirements document and align with the existing frontend implementation.

## Entity Relationship Diagram

```
+----------------+       +----------------+       +----------------+
| Tenant         |       | User           |       | Location       |
+----------------+       +----------------+       +----------------+
| id             |<----->| id             |       | id             |
| name           |       | tenantId       |       | tenantId       |
| plan           |       | name           |       | name           |
| features       |       | email          |       | address        |
| createdAt      |       | role           |       | city           |
| updatedAt      |       | passwordHash   |       | state          |
+----------------+       | createdAt      |       | zipCode        |
                         | updatedAt      |       | isActive       |
                         +----------------+       | createdAt      |
                                                  | updatedAt      |
                                                  +----------------+
                                                         |
+----------------+       +----------------+              |
| Vendor         |       | Customer       |              |
+----------------+       +----------------+              |
| id             |       | id             |              |
| tenantId       |       | tenantId       |              |
| code           |       | code           |              |
| name           |       | name           |              |
| contactName    |       | contactName    |              |
| email          |       | email          |              |
| phone          |       | phone          |              |
| address        |       | address        |              |
| paymentTerms   |       | creditLimit    |              |
| notes          |       | paymentTerms   |              |
| isActive       |       | notes          |              |
| createdAt      |       | isActive       |              |
| updatedAt      |       | createdAt      |              |
+----------------+       | updatedAt      |              |
       |                 +----------------+              |
       |                        |                        |
       v                        v                        v
+----------------+       +----------------+       +----------------+
| PurchaseOrder  |       | Sale           |       | Product        |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| tenantId       |       | tenantId       |       | tenantId       |
| vendorId       |       | customerId     |       | name           |
| poNumber       |       | saleNumber     |       | vendorId       |
| orderDate      |       | saleDate       |       | vendorCode     |
| expectedDate   |       | total          |       | category       |
| status         |       | status         |       | strainType     |
| total          |       | paymentStatus  |       | description    |
| notes          |       | paymentDate    |       | wholesalePrice |
| createdAt      |       | notes          |       | retailPrice    |
| updatedAt      |       | createdAt      |       | imageUrls      |
+----------------+       | updatedAt      |       | isActive       |
       |                 +----------------+       | createdAt      |
       |                        |                 | updatedAt      |
       v                        v                 +----------------+
+----------------+       +----------------+              |
| POItem         |       | SaleItem       |              |
+----------------+       +----------------+              |
| id             |       | id             |              |
| poId           |       | saleId         |              |
| productId      |       | productId      |<-------------+
| quantity       |       | quantity       |
| price          |       | price          |
| total          |       | total          |
| createdAt      |       | createdAt      |
| updatedAt      |       | updatedAt      |
+----------------+       +----------------+

+----------------+       +----------------+       +----------------+
| Payment        |       | InventoryRecord|       | InventoryImage |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| tenantId       |       | tenantId       |       | productId      |
| entityType     |       | productId      |       | imageUrl       |
| entityId       |       | locationId     |       | isPrimary      |
| amount         |       | quantity       |       | createdAt      |
| paymentDate    |       | batchNumber    |       | updatedAt      |
| paymentMethod  |       | createdAt      |       +----------------+
| reference      |       | updatedAt      |
| notes          |       +----------------+
| createdAt      |
| updatedAt      |
+----------------+
```

## Tables and Relationships

### Tenant
- **Purpose**: Stores information about each tenant (company) using the system
- **Fields**:
  - `id`: UUID, primary key
  - `name`: String, name of the tenant
  - `plan`: String, subscription plan (e.g., 'basic', 'enterprise')
  - `features`: JSON, enabled features for this tenant
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - One-to-many with Users
  - One-to-many with Customers
  - One-to-many with Vendors
  - One-to-many with Products
  - One-to-many with Sales
  - One-to-many with PurchaseOrders
  - One-to-many with Locations
  - One-to-many with InventoryRecords
  - One-to-many with Payments

### User
- **Purpose**: Stores user accounts that can access the system
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `name`: String, user's full name
  - `email`: String, unique email address
  - `role`: String, user role (e.g., 'admin', 'user')
  - `passwordHash`: String, hashed password
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant

### Customer
- **Purpose**: Stores customer information
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `code`: String, unique customer code (e.g., 'CUST001')
  - `name`: String, customer name
  - `contactName`: String, primary contact name
  - `email`: String, contact email
  - `phone`: String, contact phone
  - `address`: String, customer address
  - `creditLimit`: Decimal, approved credit limit
  - `paymentTerms`: String, payment terms (e.g., 'Net 30')
  - `notes`: Text, additional notes
  - `isActive`: Boolean, whether customer is active
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - One-to-many with Sales

### Vendor
- **Purpose**: Stores vendor information
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `code`: String, unique vendor code (e.g., 'VEND001')
  - `name`: String, vendor name
  - `contactName`: String, primary contact name
  - `email`: String, contact email
  - `phone`: String, contact phone
  - `address`: String, vendor address
  - `paymentTerms`: String, payment terms (e.g., 'Net 30')
  - `notes`: Text, additional notes
  - `isActive`: Boolean, whether vendor is active
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - One-to-many with Products
  - One-to-many with PurchaseOrders

### Product
- **Purpose**: Stores product information
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `name`: String, product name
  - `vendorId`: UUID, foreign key to Vendor
  - `vendorCode`: String, vendor's code for this product
  - `category`: String, product category (indoor, outdoor, light dep, concentrate, vape, other)
  - `strainType`: String, strain type (indica, sativa, hybrid)
  - `description`: Text, product description
  - `wholesalePrice`: Decimal, wholesale price
  - `retailPrice`: Decimal, suggested retail price
  - `imageUrls`: JSON, array of image URLs
  - `isActive`: Boolean, whether product is active
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - Many-to-one with Vendor
  - One-to-many with InventoryRecords
  - One-to-many with SaleItems
  - One-to-many with POItems
  - One-to-many with InventoryImages

### Location
- **Purpose**: Stores inventory location information
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `name`: String, location name
  - `address`: String, location address
  - `city`: String, location city
  - `state`: String, location state
  - `zipCode`: String, location zip code
  - `isActive`: Boolean, whether location is active
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - One-to-many with InventoryRecords

### InventoryRecord
- **Purpose**: Tracks inventory levels by product and location
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `productId`: UUID, foreign key to Product
  - `locationId`: UUID, foreign key to Location
  - `quantity`: Decimal, current quantity
  - `batchNumber`: String, batch or lot number
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - Many-to-one with Product
  - Many-to-one with Location

### InventoryImage
- **Purpose**: Stores product images
- **Fields**:
  - `id`: UUID, primary key
  - `productId`: UUID, foreign key to Product
  - `imageUrl`: String, URL to image
  - `isPrimary`: Boolean, whether this is the primary image
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Product

### Sale
- **Purpose**: Stores sales information
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `customerId`: UUID, foreign key to Customer
  - `saleNumber`: String, unique sale number
  - `saleDate`: DateTime, date of sale
  - `total`: Decimal, total sale amount
  - `status`: String, sale status (e.g., 'pending', 'completed')
  - `paymentStatus`: String, payment status (e.g., 'unpaid', 'partial', 'paid')
  - `paymentDate`: DateTime, date of payment
  - `notes`: Text, additional notes
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - Many-to-one with Customer
  - One-to-many with SaleItems
  - One-to-many with Payments (where entityType = 'sale')

### SaleItem
- **Purpose**: Stores individual items in a sale
- **Fields**:
  - `id`: UUID, primary key
  - `saleId`: UUID, foreign key to Sale
  - `productId`: UUID, foreign key to Product
  - `quantity`: Decimal, quantity sold
  - `price`: Decimal, price per unit
  - `total`: Decimal, total price (quantity * price)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Sale
  - Many-to-one with Product

### PurchaseOrder
- **Purpose**: Stores purchase order information
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `vendorId`: UUID, foreign key to Vendor
  - `poNumber`: String, unique purchase order number
  - `orderDate`: DateTime, date order was placed
  - `expectedDate`: DateTime, expected delivery date
  - `status`: String, order status (e.g., 'pending', 'received')
  - `total`: Decimal, total order amount
  - `notes`: Text, additional notes
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - Many-to-one with Vendor
  - One-to-many with POItems
  - One-to-many with Payments (where entityType = 'purchaseOrder')

### POItem
- **Purpose**: Stores individual items in a purchase order
- **Fields**:
  - `id`: UUID, primary key
  - `poId`: UUID, foreign key to PurchaseOrder
  - `productId`: UUID, foreign key to Product
  - `quantity`: Decimal, quantity ordered
  - `price`: Decimal, price per unit
  - `total`: Decimal, total price (quantity * price)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with PurchaseOrder
  - Many-to-one with Product

### Payment
- **Purpose**: Tracks payments for sales and purchase orders
- **Fields**:
  - `id`: UUID, primary key
  - `tenantId`: UUID, foreign key to Tenant
  - `entityType`: String, type of entity payment is for ('sale' or 'purchaseOrder')
  - `entityId`: UUID, ID of the related entity
  - `amount`: Decimal, payment amount
  - `paymentDate`: DateTime, date of payment
  - `paymentMethod`: String, method of payment
  - `reference`: String, payment reference number
  - `notes`: Text, additional notes
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - Many-to-one with Tenant
  - Polymorphic relationship with Sale or PurchaseOrder

## Reporting Tables

In addition to the core entity tables, the database schema includes specialized tables for reporting functionality:

### Reporting Metadata Tables

- **ReportDefinitions**: Stores metadata about available reports
- **ReportParameters**: Stores parameters for customizable reports
- **ReportLayouts**: Stores layout configurations for reports

### Dashboard Configuration Tables

- **Dashboards**: Stores dashboard definitions
- **DashboardWidgets**: Stores widgets for dashboards
- **UserDashboards**: Stores user-specific dashboard configurations

### Report Scheduling and Distribution Tables

- **ScheduledReports**: Stores scheduled report configurations
- **ReportDistributions**: Stores distribution configurations for scheduled reports

### Audit and History Tables

- **ReportExecutionHistory**: Stores history of report executions
- **ReportAuditLog**: Stores audit log for reporting-related actions

See the `reporting_features.md` document for detailed field definitions and relationships for these tables.

## Database Views for Reporting

The schema includes several database views to facilitate reporting:

### Financial Reporting Views
- **FinancialSummaryView**: Provides a summary of financial transactions
- **ProfitAndLossView**: Provides monthly profit and loss summary

### Sales Reporting Views
- **SalesSummaryView**: Provides a summary of sales
- **ProductSalesView**: Provides product sales analysis

### Inventory Reporting Views
- **InventorySummaryView**: Provides a summary of inventory
- **InventoryMovementView**: Provides inventory movement history

### Customer Reporting Views
- **CustomerAnalyticsView**: Provides customer analytics

### Vendor Reporting Views
- **VendorPerformanceView**: Provides vendor performance metrics

## Database Technology Recommendations

Based on the requirements and the current architecture, we recommend using:

1. **PostgreSQL** - A robust relational database that supports:
   - JSON data types for flexible storage of features and configurations
   - Strong transactional support for financial operations
   - Excellent indexing capabilities for performance
   - Mature ecosystem with good hosting options
   - Advanced features like views, stored procedures, and partitioning for reporting

2. **Prisma ORM** - A modern ORM that works well with Next.js:
   - Type-safe database access
   - Auto-generated migrations
   - Easy integration with TypeScript
   - Support for complex relationships

## Migration Strategy

The migration from localStorage to a proper database should be implemented in phases:

1. Set up the database schema using Prisma
2. Create API routes that mirror the existing localStorage API
3. Modify the frontend hooks to use the new API routes instead of localStorage
4. Implement a data migration utility to transfer existing localStorage data to the database
5. Add authentication and authorization to the API routes

This approach allows for a gradual transition with minimal disruption to the existing functionality.
