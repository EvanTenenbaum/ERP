/**
 * Database schema definitions for the ERP system
 * 
 * This file defines the data models for the core entities in the system:
 * - Customers
 * - Inventory/Products
 * - Sales/Orders
 * - Vendors
 * 
 * These schemas will be used with a database adapter that can be swapped
 * without changing the application logic.
 */

// Customer schema
const customerSchema = {
  id: 'string', // Unique identifier
  code: 'string', // Customer code for easy identification (e.g., CUST001)
  name: 'string', // Business name
  contact: 'string', // Primary contact person
  email: 'string', // Contact email
  phone: 'string', // Contact phone
  address: {
    street: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    country: 'string',
  },
  status: 'string', // active, inactive, pending
  creditLimit: 'number', // Maximum credit allowed
  paymentTerms: 'string', // Payment terms (e.g., Net 30)
  notes: 'string', // Additional notes
  customFields: 'object', // Flexible custom fields
  createdAt: 'date',
  updatedAt: 'date',
};

// Product/Inventory schema
const productSchema = {
  id: 'string', // Unique identifier
  sku: 'string', // Stock keeping unit
  name: 'string', // Product name
  description: 'string', // Product description
  category: 'string', // Product category (indoor, outdoor, light dep, concentrate, vape, other)
  strainType: 'string', // Strain type (indica, sativa, hybrid)
  vendorId: 'string', // Reference to vendor
  vendorCode: 'string', // Vendor code for easy identification
  locations: 'array', // Array of location objects where product is stored
  price: 'number', // Price per unit
  costPrice: 'number', // Cost price per unit
  quantity: 'number', // Current quantity in stock
  unit: 'string', // Unit of measurement
  images: 'array', // Array of image URLs
  batchNumber: 'string', // Batch or lot number for hemp flower products
  notes: 'string', // Additional notes
  customFields: 'object', // Flexible custom fields
  createdAt: 'date',
  updatedAt: 'date',
};

// Location schema (for multi-location inventory)
const locationSchema = {
  id: 'string', // Unique identifier
  name: 'string', // Location name
  address: {
    street: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    country: 'string',
  },
  isActive: 'boolean', // Whether the location is active
  createdAt: 'date',
  updatedAt: 'date',
};

// Inventory record schema (for tracking inventory at specific locations)
const inventoryRecordSchema = {
  id: 'string', // Unique identifier
  productId: 'string', // Reference to product
  locationId: 'string', // Reference to location
  quantity: 'number', // Quantity at this location
  createdAt: 'date',
  updatedAt: 'date',
};

// Sale/Order schema
const saleSchema = {
  id: 'string', // Unique identifier
  orderNumber: 'string', // Order number for reference
  customerId: 'string', // Reference to customer
  customerCode: 'string', // Customer code for easy identification
  status: 'string', // pending, processing, shipped, delivered, cancelled
  items: 'array', // Array of line items
  subtotal: 'number', // Subtotal before tax and discounts
  taxRate: 'number', // Tax rate as percentage
  taxAmount: 'number', // Calculated tax amount
  discountType: 'string', // percentage or fixed
  discountValue: 'number', // Discount percentage or amount
  discountAmount: 'number', // Calculated discount amount
  total: 'number', // Total after tax and discounts
  notes: 'string', // Additional notes
  paymentStatus: 'string', // paid, partial, unpaid
  paymentMethod: 'string', // Method of payment
  paymentReference: 'string', // Reference number for payment
  paymentDate: 'date', // Date of payment
  shippingAddress: {
    street: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    country: 'string',
  },
  shippingMethod: 'string', // Method of shipping
  trackingNumber: 'string', // Shipping tracking number
  salesRepId: 'string', // Reference to sales representative
  commission: 'number', // Commission amount
  customFields: 'object', // Flexible custom fields
  createdAt: 'date',
  updatedAt: 'date',
};

// Line item schema (for sales/orders)
const lineItemSchema = {
  id: 'string', // Unique identifier
  productId: 'string', // Reference to product
  productSku: 'string', // Product SKU for reference
  productName: 'string', // Product name for reference
  quantity: 'number', // Quantity ordered
  unitPrice: 'number', // Price per unit
  locationId: 'string', // Source location for inventory
  subtotal: 'number', // Calculated subtotal for line item
  notes: 'string', // Additional notes
};

// Vendor schema
const vendorSchema = {
  id: 'string', // Unique identifier
  code: 'string', // Vendor code for easy identification (e.g., VEND001)
  name: 'string', // Business name
  contact: 'string', // Primary contact person
  email: 'string', // Contact email
  phone: 'string', // Contact phone
  address: {
    street: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    country: 'string',
  },
  status: 'string', // active, inactive, pending
  paymentTerms: 'string', // Payment terms (e.g., Net 30)
  notes: 'string', // Additional notes
  customFields: 'object', // Flexible custom fields
  createdAt: 'date',
  updatedAt: 'date',
};

// Purchase order schema
const purchaseOrderSchema = {
  id: 'string', // Unique identifier
  poNumber: 'string', // Purchase order number for reference
  vendorId: 'string', // Reference to vendor
  vendorCode: 'string', // Vendor code for easy identification
  status: 'string', // draft, submitted, received, cancelled
  items: 'array', // Array of line items
  subtotal: 'number', // Subtotal before tax and discounts
  taxRate: 'number', // Tax rate as percentage
  taxAmount: 'number', // Calculated tax amount
  discountType: 'string', // percentage or fixed
  discountValue: 'number', // Discount percentage or amount
  discountAmount: 'number', // Calculated discount amount
  total: 'number', // Total after tax and discounts
  notes: 'string', // Additional notes
  paymentStatus: 'string', // paid, partial, unpaid
  paymentMethod: 'string', // Method of payment
  paymentReference: 'string', // Reference number for payment
  paymentDate: 'date', // Date of payment
  deliveryAddress: {
    street: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    country: 'string',
  },
  expectedDeliveryDate: 'date', // Expected delivery date
  customFields: 'object', // Flexible custom fields
  createdAt: 'date',
  updatedAt: 'date',
};

// Tenant schema (for multi-tenant architecture)
const tenantSchema = {
  id: 'string', // Unique identifier
  name: 'string', // Tenant name
  domain: 'string', // Custom domain
  settings: 'object', // Tenant-specific settings
  plan: 'string', // Subscription plan
  isActive: 'boolean', // Whether the tenant is active
  createdAt: 'date',
  updatedAt: 'date',
};

// User schema
const userSchema = {
  id: 'string', // Unique identifier
  tenantId: 'string', // Reference to tenant
  email: 'string', // User email
  password: 'string', // Hashed password
  firstName: 'string', // First name
  lastName: 'string', // Last name
  role: 'string', // User role (admin, manager, sales, etc.)
  permissions: 'array', // Array of permission strings
  isActive: 'boolean', // Whether the user is active
  lastLogin: 'date', // Last login date
  createdAt: 'date',
  updatedAt: 'date',
};

// Export all schemas
module.exports = {
  customerSchema,
  productSchema,
  locationSchema,
  inventoryRecordSchema,
  saleSchema,
  lineItemSchema,
  vendorSchema,
  purchaseOrderSchema,
  tenantSchema,
  userSchema,
};
