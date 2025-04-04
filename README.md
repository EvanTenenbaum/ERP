# Multi-Tenant ERP System

A comprehensive ERP system for hemp flower wholesale brokerage businesses, built with Next.js.

## Overview

This ERP system provides a complete solution for managing customers, inventory, sales, vendors, and reporting for hemp flower wholesale brokerage businesses. The system is designed to handle hundreds of SKUs per month and dozens of vendors and customers, with performance tracking and financial tracking for each.

## Features

- **Customer Management**: Track customer information, sales history, and payment patterns
- **Inventory Management**: Track inventory across multiple locations with product images
- **Sales Management**: Create and manage sales with invoice generation
- **Vendor Management**: Track vendor information and payment history
- **Reporting**: Comprehensive reporting with export and print functionality
- **Dashboard**: High-level business metrics and customer rankings

## Industry-Specific Features

- **Multi-Location Inventory**: Track inventory across multiple physical locations
- **Payment Tracking**: Track payments to vendors and from customers, with the ability to apply payments to specific invoices
- **Credit Recommendations**: Smart recommendations for extending credit to customers based on purchase and payment history
- **Customer and Vendor Coding**: Unique codes for all customers and vendors for easy identification
- **Product Images**: Take and store product images associated with specific SKUs
- **Invoice Generation**: Create invoices for sales directly within the system

## Technical Implementation

- Built with Next.js framework
- Responsive design for all device sizes
- Comprehensive error handling
- Automated CI/CD pipeline for continuous deployment

## Documentation

- [GitHub Integration and CI/CD Pipeline](./GITHUB_INTEGRATION.md)
- [Project Status](./PROJECT_STATUS.md)

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is automatically deployed through the CI/CD pipeline configured in GitHub Actions. Any changes pushed to the main branch will trigger a new deployment.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
