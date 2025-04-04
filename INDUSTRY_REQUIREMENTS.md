# Hemp Flower Wholesale Brokerage Industry-Specific Requirements

This document outlines the industry-specific requirements for the Multi-Tenant ERP System designed for hemp flower wholesale brokerage businesses.

## Business Scale and Operations

- Handles hundreds of SKUs per month
- Manages dozens of vendors and customers
- Requires performance tracking for each vendor and customer
- Needs financial tracking for each vendor and customer
- No reorder points needed in the inventory management system

## Inventory Management

### Multi-Location Tracking
- System must track inventory across multiple physical locations
- Each inventory item must be associated with a specific location
- Ability to transfer inventory between locations

### Product Categorization
- Inventory must be categorizable by:
  - Price range
  - Category (indoor, outdoor, light dep, concentrate, vape, other)
  - Strain type (indica, sativa, hybrid)

### Product Images
- Inventory intake process must allow taking pictures of products
- Images must remain associated with the specific SKU within the system
- Images should be viewable in inventory listings and detail pages

### SKU Naming Convention
- Each SKU must include the vendor code in the name when presented on inventory sheets
- This facilitates quick identification of product sources

## Customer Management

### Customer Coding
- System must associate unique codes with all customers
- Codes should be used for easy identification and reference
- Customer codes should appear in all related transactions and reports

### Credit Management
- System must provide smart recommendations for extending credit to customers
- Recommendations should be based on:
  - Purchase history
  - Payment history
  - Balance of creditworthiness with revenue potential
- Credit limits should be configurable per customer

## Vendor Management

### Vendor Coding
- System must associate unique codes with all vendors
- Codes should be used for easy identification and reference
- Vendor codes should appear in all related transactions and reports

## Payment Tracking

### Customer Payments
- System must track payments received from customers
- Ability to apply payments to specific open invoices
- Easy tracking of payment status for all invoices

### Vendor Payments
- System must track payments to vendors
- Ability to apply payments to specific open invoices
- Easy tracking of payment status for all invoices

## Sales Management

### Invoice Generation
- Functionality to create invoices for sales directly within the system
- Invoices should include all relevant product and customer information
- Ability to print and export invoices in various formats

## Reporting

### Metric Summaries
- System must include metric summaries for quick reference and analysis
- Metrics should cover sales, inventory, customer activity, and vendor performance

### Customer and Vendor Profiles
- Detailed profiles displaying relevant business information
- Historical data on transactions, payments, and performance

## User Interface Requirements

### Filtering Capabilities
- Available inventory database must allow filtering by:
  - Price range
  - Category (indoor, outdoor, light dep, concentrate, vape, other)
  - Strain type (indica, sativa, hybrid)
  - Location
  - Vendor

### Dashboard Views
- Customizable dashboard with key metrics
- Quick access to frequently used functions
- Visual representations of important business data
