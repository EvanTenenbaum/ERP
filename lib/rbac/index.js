export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const PERMISSIONS = {
  // Customer permissions
  VIEW_CUSTOMERS: 'view_customers',
  CREATE_CUSTOMER: 'create_customer',
  EDIT_CUSTOMER: 'edit_customer',
  DELETE_CUSTOMER: 'delete_customer',
  
  // Inventory permissions
  VIEW_INVENTORY: 'view_inventory',
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  MANAGE_INVENTORY: 'manage_inventory',
  
  // Sales permissions
  VIEW_SALES: 'view_sales',
  CREATE_SALE: 'create_sale',
  EDIT_SALE: 'edit_sale',
  DELETE_SALE: 'delete_sale',
  
  // Vendor permissions
  VIEW_VENDORS: 'view_vendors',
  CREATE_VENDOR: 'create_vendor',
  EDIT_VENDOR: 'edit_vendor',
  DELETE_VENDOR: 'delete_vendor',
  
  // Report permissions
  VIEW_REPORTS: 'view_reports',
  
  // User management permissions
  MANAGE_USERS: 'manage_users',
  
  // Tenant management permissions
  MANAGE_TENANT: 'manage_tenant',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.EDIT_CUSTOMER,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.EDIT_SALE,
    PERMISSIONS.VIEW_VENDORS,
    PERMISSIONS.CREATE_VENDOR,
    PERMISSIONS.EDIT_VENDOR,
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.VIEW_VENDORS,
    PERMISSIONS.VIEW_REPORTS,
  ],
};

export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}
