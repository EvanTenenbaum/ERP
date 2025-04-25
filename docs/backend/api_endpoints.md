# API Endpoints for Hemp Flower Wholesale ERP

## Overview
This document outlines the proposed API endpoints for the Hemp Flower Wholesale ERP system. The API is designed to support all the requirements identified in the industry requirements document and align with the existing frontend implementation.

## API Structure

The API will follow RESTful principles and be organized around resources. All endpoints will be prefixed with `/api` and will use standard HTTP methods:

- `GET`: Retrieve resources
- `POST`: Create resources
- `PUT`: Update resources
- `DELETE`: Remove resources

The API is organized into the following categories:
- Authentication endpoints
- Core business entities (customers, inventory, sales, vendors)
- Reporting and analytics endpoints
- Dashboard configuration endpoints

## Authentication Endpoints

### User Authentication
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
GET /api/auth/session
POST /api/auth/password/reset
POST /api/auth/password/update
```

### Tenant Management
```
GET /api/tenants
GET /api/tenants/:id
POST /api/tenants
PUT /api/tenants/:id
DELETE /api/tenants/:id
```

## Customer Endpoints

### Customer Management
```
GET /api/customers
GET /api/customers/:id
POST /api/customers
PUT /api/customers/:id
DELETE /api/customers/:id
```

### Customer Metrics and Analysis
```
GET /api/customers/:id/metrics
GET /api/customers/:id/sales-history
GET /api/customers/:id/credit-recommendation
GET /api/customers/segments
```

## Inventory Endpoints

### Product Management
```
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
GET /api/products/search?query=:query
GET /api/products/category/:category
GET /api/products/strain-type/:type
GET /api/products/price-range?min=:min&max=:max
GET /api/products/vendor/:vendorId
GET /api/products/low-inventory?threshold=:threshold
```

### Location Management
```
GET /api/locations
GET /api/locations/:id
POST /api/locations
PUT /api/locations/:id
DELETE /api/locations/:id
```

### Inventory Management
```
GET /api/inventory
GET /api/inventory/product/:productId
GET /api/inventory/location/:locationId
POST /api/inventory/add
POST /api/inventory/remove
POST /api/inventory/transfer
```

### Product Images
```
GET /api/products/:id/images
POST /api/products/:id/images
DELETE /api/products/:id/images/:imageId
PUT /api/products/:id/images/:imageId/set-primary
```

## Sales Endpoints

### Sales Management
```
GET /api/sales
GET /api/sales/:id
POST /api/sales
PUT /api/sales/:id
DELETE /api/sales/:id
GET /api/sales/customer/:customerId
```

### Sale Items
```
GET /api/sales/:id/items
POST /api/sales/:id/items
PUT /api/sales/:id/items/:itemId
DELETE /api/sales/:id/items/:itemId
```

## Vendor Endpoints

### Vendor Management
```
GET /api/vendors
GET /api/vendors/:id
POST /api/vendors
PUT /api/vendors/:id
DELETE /api/vendors/:id
```

### Vendor Metrics and Analysis
```
GET /api/vendors/:id/metrics
GET /api/vendors/:id/purchase-orders
GET /api/vendors/:id/performance
```

## Purchase Order Endpoints

### Purchase Order Management
```
GET /api/purchase-orders
GET /api/purchase-orders/:id
POST /api/purchase-orders
PUT /api/purchase-orders/:id
DELETE /api/purchase-orders/:id
GET /api/purchase-orders/vendor/:vendorId
```

### Purchase Order Items
```
GET /api/purchase-orders/:id/items
POST /api/purchase-orders/:id/items
PUT /api/purchase-orders/:id/items/:itemId
DELETE /api/purchase-orders/:id/items/:itemId
```

## Payment Endpoints

### Payment Management
```
GET /api/payments
GET /api/payments/:id
POST /api/payments
PUT /api/payments/:id
DELETE /api/payments/:id
GET /api/payments/entity/:entityType/:entityId
```

### Payment Processing
```
POST /api/payments/process-sale-payment
POST /api/payments/process-purchase-order-payment
```

## Reporting Endpoints

### Sales Reports
```
GET /api/reports/sales?startDate=:start&endDate=:end&groupBy=:groupBy
GET /api/reports/sales/by-customer?startDate=:start&endDate=:end
GET /api/reports/sales/by-product?startDate=:start&endDate=:end
```

### Financial Reports
```
GET /api/reports/financial?startDate=:start&endDate=:end&groupBy=:groupBy
GET /api/reports/financial/accounts-receivable
GET /api/reports/financial/accounts-payable
```

### Inventory Reports
```
GET /api/reports/inventory/current-levels
GET /api/reports/inventory/movement?startDate=:start&endDate=:end
GET /api/reports/inventory/valuation
```

### Dashboard Data
```
GET /api/dashboard/summary
GET /api/dashboard/recent-sales
GET /api/dashboard/upcoming-payments
GET /api/dashboard/low-stock-products
```

## Reporting Endpoints

### Report Definition Management
```
GET /api/reports
GET /api/reports/:id
POST /api/reports
PUT /api/reports/:id
DELETE /api/reports/:id
```

### Report Execution
```
POST /api/reports/:id/execute
GET /api/reports/executions
GET /api/reports/executions/:id
GET /api/reports/executions/:id/download
```

### Dashboard Management
```
GET /api/dashboards
GET /api/dashboards/:id
POST /api/dashboards
PUT /api/dashboards/:id
DELETE /api/dashboards/:id
GET /api/dashboards/:id/widgets
POST /api/dashboards/:id/widgets
PUT /api/dashboards/:id/widgets/:widgetId
DELETE /api/dashboards/:id/widgets/:widgetId
```

### Report Scheduling
```
GET /api/reports/:id/schedules
POST /api/reports/:id/schedules
PUT /api/reports/:id/schedules/:scheduleId
DELETE /api/reports/:id/schedules/:scheduleId
POST /api/reports/:id/schedules/:scheduleId/execute
```

### Analytics
```
GET /api/analytics/sales
GET /api/analytics/inventory
GET /api/analytics/customers
GET /api/analytics/vendors
GET /api/analytics/finance
```

## API Implementation Details

### Request and Response Format

All API endpoints will use JSON for request and response bodies:

```json
// Example response for GET /api/customers/:id
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tenantId": "550e8400-e29b-41d4-a716-446655440001",
  "code": "CUST001",
  "name": "Acme Hemp Dispensary",
  "contactName": "John Smith",
  "email": "john@acmehemp.com",
  "phone": "555-123-4567",
  "address": "123 Main St, Anytown, CA 90210",
  "creditLimit": 5000.00,
  "paymentTerms": "Net 30",
  "notes": "Prefers deliveries on Tuesdays",
  "isActive": true,
  "createdAt": "2025-01-15T12:00:00Z",
  "updatedAt": "2025-04-10T15:30:00Z"
}
```

### Error Handling

All API endpoints will use standard HTTP status codes and return error details in a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Customer with ID 550e8400-e29b-41d4-a716-446655440000 not found",
    "details": {
      "resourceType": "customer",
      "resourceId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

### Pagination

List endpoints will support pagination using query parameters:

```
GET /api/customers?page=1&limit=20
```

Response will include pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 156,
    "totalPages": 8
  }
}
```

### Filtering and Sorting

List endpoints will support filtering and sorting using query parameters:

```
GET /api/products?category=indoor&minPrice=100&maxPrice=500&sort=price&order=asc
```

### Implementation Strategy

The API endpoints will be implemented using Next.js API routes, which provide a convenient way to build API endpoints within the Next.js application. Each API route will:

1. Validate the request
2. Authenticate and authorize the user
3. Perform the requested operation using Prisma ORM
4. Return the appropriate response

Example implementation of a Next.js API route:

```javascript
// app/api/customers/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Get customer by ID
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
    });
    
    if (!customer) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Customer with ID ${id} not found`,
            details: { resourceType: 'customer', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    
    // Update customer
    const customer = await prisma.customer.update({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      data,
    });
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Delete customer
    await prisma.customer.delete({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
```

## Frontend Integration

The existing frontend hooks will need to be updated to use the new API endpoints instead of localStorage. For example, the `useCustomers` hook would be modified to:

```javascript
import { useState, useEffect, useCallback } from 'react';

export function useCustomers(initialFilters = {}) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  // ... other state variables

  // Fetch customers based on filters
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      // Call API endpoint
      const response = await fetch(`/api/customers?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch customers');
      }
      
      const data = await response.json();
      setCustomers(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ... other methods modified to use API endpoints

  return {
    // State
    customers,
    loading,
    error,
    filters,
    // ... other state
    
    // Actions
    fetchCustomers,
    // ... other methods
  };
}
```

This approach allows for a gradual transition from localStorage to the API-based backend while maintaining the same interface for components using these hooks.

## API Documentation

The API will be documented using OpenAPI (Swagger) specification, which will:

1. Provide a clear reference for frontend developers
2. Enable automatic generation of API clients
3. Facilitate API testing and validation

The OpenAPI documentation will be available at `/api/docs` when the application is running in development mode.

## Security Considerations

1. **Authentication**: All API endpoints (except public ones like login) will require authentication
2. **Authorization**: Access control will be enforced based on user roles
3. **Tenant Isolation**: All data access will be scoped to the user's tenant
4. **Input Validation**: All request data will be validated before processing
5. **Rate Limiting**: API endpoints will be protected against abuse with rate limiting
6. **CORS**: Cross-Origin Resource Sharing will be configured to allow only trusted origins
