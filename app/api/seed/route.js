import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_TENANT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    // Create a default tenant if it doesn't exist
    const defaultTenant = await prisma.tenant.upsert({
      where: { id: 'default-tenant-id' },
      update: {},
      create: {
        id: 'default-tenant-id',
        name: 'Default Hemp Wholesale',
        subdomain: 'default',
        isActive: true,
        settings: {
          theme: 'light',
          defaultCurrency: 'USD',
          dateFormat: 'MM/DD/YYYY',
        },
      },
    });

    console.log(`Created default tenant: ${defaultTenant.name}`);

    // Create admin user if it doesn't exist
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        tenantId: defaultTenant.id,
        isActive: true,
      },
    });

    console.log(`Created admin user: ${adminUser.email}`);

    // Create manager user if it doesn't exist
    const managerPassword = await bcrypt.hash('Manager123!', 10);
    const managerUser = await prisma.user.upsert({
      where: { email: 'manager@example.com' },
      update: {},
      create: {
        email: 'manager@example.com',
        name: 'Manager User',
        password: managerPassword,
        role: 'MANAGER',
        tenantId: defaultTenant.id,
        isActive: true,
      },
    });

    console.log(`Created manager user: ${managerUser.email}`);

    // Create regular user if it doesn't exist
    const userPassword = await bcrypt.hash('User123!', 10);
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        password: userPassword,
        role: 'USER',
        tenantId: defaultTenant.id,
        isActive: true,
      },
    });

    console.log(`Created regular user: ${regularUser.email}`);

    // Create sample locations
    const warehouse = await prisma.location.upsert({
      where: { id: 'warehouse-1' },
      update: {},
      create: {
        id: 'warehouse-1',
        name: 'Main Warehouse',
        address: '123 Storage Ave, Warehouse District',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        isActive: true,
        tenantId: defaultTenant.id,
      },
    });

    const storefront = await prisma.location.upsert({
      where: { id: 'storefront-1' },
      update: {},
      create: {
        id: 'storefront-1',
        name: 'Downtown Storefront',
        address: '456 Main St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97204',
        isActive: true,
        tenantId: defaultTenant.id,
      },
    });

    console.log(`Created locations: ${warehouse.name}, ${storefront.name}`);

    // Create sample products
    const products = [
      {
        id: 'product-1',
        name: 'Premium CBD Flower',
        description: 'High-quality CBD flower with 15% CBD content',
        category: 'CBD',
        strainType: 'Hybrid',
        thcContent: 0.2,
        cbdContent: 15.0,
        wholesalePrice: 800.00,
        retailPrice: 1200.00,
        sku: 'CBD-PRM-001',
        barcode: '123456789012',
        isActive: true,
        tenantId: defaultTenant.id,
      },
      {
        id: 'product-2',
        name: 'Sativa Hemp Flower',
        description: 'Energizing sativa strain with terpene-rich profile',
        category: 'Hemp',
        strainType: 'Sativa',
        thcContent: 0.1,
        cbdContent: 12.5,
        wholesalePrice: 650.00,
        retailPrice: 950.00,
        sku: 'HMP-SAT-001',
        barcode: '223456789012',
        isActive: true,
        tenantId: defaultTenant.id,
      },
      {
        id: 'product-3',
        name: 'Indica Hemp Flower',
        description: 'Relaxing indica strain perfect for evening use',
        category: 'Hemp',
        strainType: 'Indica',
        thcContent: 0.15,
        cbdContent: 14.0,
        wholesalePrice: 700.00,
        retailPrice: 1050.00,
        sku: 'HMP-IND-001',
        barcode: '323456789012',
        isActive: true,
        tenantId: defaultTenant.id,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: product,
      });
    }

    console.log(`Created ${products.length} products`);

    // Create sample customers
    const customers = [
      {
        id: 'customer-1',
        name: 'Green Life Dispensary',
        code: 'GLD001',
        email: 'orders@greenlife.com',
        phone: '503-555-1234',
        address: '789 Wellness Blvd',
        city: 'Eugene',
        state: 'OR',
        zipCode: '97401',
        creditLimit: 10000.00,
        terms: 'Net 30',
        notes: 'Prefers delivery on Tuesdays',
        isActive: true,
        tenantId: defaultTenant.id,
      },
      {
        id: 'customer-2',
        name: 'Healing Hemp Co-op',
        code: 'HHC002',
        email: 'purchasing@healinghemp.org',
        phone: '503-555-5678',
        address: '456 Natural Way',
        city: 'Bend',
        state: 'OR',
        zipCode: '97701',
        creditLimit: 5000.00,
        terms: 'Net 15',
        notes: 'New customer, growing quickly',
        isActive: true,
        tenantId: defaultTenant.id,
      },
      {
        id: 'customer-3',
        name: 'CBD Wellness Center',
        code: 'CWC003',
        email: 'info@cbdwellness.com',
        phone: '503-555-9012',
        address: '123 Health Street',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        creditLimit: 7500.00,
        terms: 'Net 30',
        notes: 'Interested in bulk discounts',
        isActive: true,
        tenantId: defaultTenant.id,
      },
    ];

    for (const customer of customers) {
      await prisma.customer.upsert({
        where: { id: customer.id },
        update: {},
        create: customer,
      });
    }

    console.log(`Created ${customers.length} customers`);

    // Create sample vendors
    const vendors = [
      {
        id: 'vendor-1',
        name: 'Oregon Hemp Farms',
        code: 'OHF001',
        email: 'sales@oregonhempfarms.com',
        phone: '541-555-1234',
        address: '1000 Farm Road',
        city: 'Medford',
        state: 'OR',
        zipCode: '97501',
        paymentTerms: 'Net 45',
        notes: 'Organic certified grower',
        isActive: true,
        tenantId: defaultTenant.id,
      },
      {
        id: 'vendor-2',
        name: 'Pacific Northwest Cultivators',
        code: 'PNC002',
        email: 'wholesale@pncultivators.com',
        phone: '360-555-5678',
        address: '500 Grow Lane',
        city: 'Vancouver',
        state: 'WA',
        zipCode: '98660',
        paymentTerms: 'Net 30',
        notes: 'Specializes in high-CBD strains',
        isActive: true,
        tenantId: defaultTenant.id,
      },
    ];

    for (const vendor of vendors) {
      await prisma.vendor.upsert({
        where: { id: vendor.id },
        update: {},
        create: vendor,
      });
    }

    console.log(`Created ${vendors.length} vendors`);

    // Create inventory records
    const inventoryRecords = [
      {
        productId: 'product-1',
        locationId: 'warehouse-1',
        quantity: 50.0,
        unit: 'lb',
        batchNumber: 'BATCH-2025-001',
        expirationDate: new Date('2026-04-25'),
        notes: 'Initial inventory',
        tenantId: defaultTenant.id,
      },
      {
        productId: 'product-2',
        locationId: 'warehouse-1',
        quantity: 35.0,
        unit: 'lb',
        batchNumber: 'BATCH-2025-002',
        expirationDate: new Date('2026-04-25'),
        notes: 'Initial inventory',
        tenantId: defaultTenant.id,
      },
      {
        productId: 'product-3',
        locationId: 'warehouse-1',
        quantity: 40.0,
        unit: 'lb',
        batchNumber: 'BATCH-2025-003',
        expirationDate: new Date('2026-04-25'),
        notes: 'Initial inventory',
        tenantId: defaultTenant.id,
      },
      {
        productId: 'product-1',
        locationId: 'storefront-1',
        quantity: 5.0,
        unit: 'lb',
        batchNumber: 'BATCH-2025-001',
        expirationDate: new Date('2026-04-25'),
        notes: 'Display inventory',
        tenantId: defaultTenant.id,
      },
      {
        productId: 'product-2',
        locationId: 'storefront-1',
        quantity: 3.0,
        unit: 'lb',
        batchNumber: 'BATCH-2025-002',
        expirationDate: new Date('2026-04-25'),
        notes: 'Display inventory',
        tenantId: defaultTenant.id,
      },
      {
        productId: 'product-3',
        locationId: 'storefront-1',
        quantity: 4.0,
        unit: 'lb',
        batchNumber: 'BATCH-2025-003',
        expirationDate: new Date('2026-04-25'),
        notes: 'Display inventory',
        tenantId: defaultTenant.id,
      },
    ];

    // Clear existing inventory records to avoid duplicates
    await prisma.inventoryRecord.deleteMany({
      where: {
        tenantId: defaultTenant.id,
      },
    });

    for (const record of inventoryRecords) {
      await prisma.inventoryRecord.create({
        data: record,
      });
    }

    console.log(`Created ${inventoryRecords.length} inventory records`);

    // Create sample sales
    // Clear existing sales to avoid duplicates
    await prisma.saleItem.deleteMany({
      where: {
        tenantId: defaultTenant.id,
      },
    });
    
    await prisma.sale.deleteMany({
      where: {
        tenantId: defaultTenant.id,
      },
    });

    const sale1 = await prisma.sale.create({
      data: {
        customerId: 'customer-1',
        saleDate: new Date('2025-04-20'),
        status: 'COMPLETED',
        subtotal: 4000.00,
        taxAmount: 0.00,
        discountAmount: 200.00,
        total: 3800.00,
        notes: 'Bulk order discount applied',
        tenantId: defaultTenant.id,
        createdById: adminUser.id,
        saleItems: {
          create: [
            {
              productId: 'product-1',
              quantity: 5.0,
              unit: 'lb',
              unitPrice: 800.00,
              subtotal: 4000.00,
              tenantId: defaultTenant.id,
            }
          ]
        }
      }
    });

    const sale2 = await prisma.sale.create({
      data: {
        customerId: 'customer-2',
        saleDate: new Date('2025-04-22'),
        status: 'COMPLETED',
        subtotal: 1950.00,
        taxAmount: 0.00,
        discountAmount: 0.00,
        total: 1950.00,
        notes: 'Regular order',
        tenantId: defaultTenant.id,
        createdById: managerUser.id,
        saleItems: {
          create: [
            {
              productId: 'product-2',
              quantity: 3.0,
              unit: 'lb',
              unitPrice: 650.00,
              subtotal: 1950.00,
              tenantId: defaultTenant.id,
            }
          ]
        }
      }
    });

    console.log(`Created 2 sales records`);

    // Create system reports
    // Clear existing reports to avoid duplicates
    await prisma.reportParameter.deleteMany({
      where: {
        report: {
          tenantId: defaultTenant.id,
        },
      },
    });
    
    await prisma.reportLayout.deleteMany({
      where: {
        report: {
          tenantId: defaultTenant.id,
        },
      },
    });
    
    await prisma.reportDefinition.deleteMany({
      where: {
        tenantId: defaultTenant.id,
      },
    });

    const reports = [
      {
        reportName: 'Sales Summary',
        reportDescription: 'Overview of sales by period',
        reportCategory: 'Sales',
        reportType: 'SalesSummary',
        isSystemReport: true,
        isActive: true,
        tenantId: defaultTenant.id,
        createdById: adminUser.id,
        parameters: {
          create: [
            {
              parameterName: 'startDate',
              parameterLabel: 'Start Date',
              parameterType: 'DATE',
              isRequired: true,
              parameterOrder: 0,
            },
            {
              parameterName: 'endDate',
              parameterLabel: 'End Date',
              parameterType: 'DATE',
              isRequired: true,
              parameterOrder: 1,
            },
            {
              parameterName: 'groupBy',
              parameterLabel: 'Group By',
              parameterType: 'SELECT',
              isRequired: false,
              defaultValue: 'day',
              parameterOrder: 2,
            }
          ]
        },
        layouts: {
          create: [
            {
              layoutName: 'Default Layout',
              layoutConfig: {
                charts: [
                  { type: 'bar', title: 'Sales by Period' },
                  { type: 'pie', title: 'Sales by Product' }
                ],
                tables: [
                  { title: 'Sales Summary', columns: ['date', 'count', 'total'] }
                ]
              },
              isDefault: true,
              createdById: adminUser.id,
            }
          ]
        }
      },
      {
        reportName: 'Inventory Status',
        reportDescription: 'Current inventory levels by location',
        reportCategory: 'Inventory',
        reportType: 'InventorySummary',
        isSystemReport: true,
        isActive: true,
        tenantId: defaultTenant.id,
        createdById: adminUser.id,
        parameters: {
          create: [
            {
              parameterName: 'locationId',
              parameterLabel: 'Location',
              parameterType: 'SELECT',
              isRequired: false,
              parameterOrder: 0,
            },
            {
              parameterName: 'category',
              parameterLabel: 'Product Category',
              parameterType: 'SELECT',
              isRequired: false,
              parameterOrder: 1,
            },
            {
              parameterName: 'lowStock',
              parameterLabel: 'Show Low Stock Only',
              parameterType: 'BOOLEAN',
              isRequired: false,
              defaultValue: 'false',
              parameterOrder: 2,
            }
          ]
        },
        layouts: {
          create: [
            {
              layoutName: 'Default Layout',
              layoutConfig: {
                charts: [
                  { type: 'bar', title: 'Inventory by Category' },
                  { type: 'pie', title: 'Inventory Value Distribution' }
                ],
                tables: [
                  { title: 'Inventory Items', columns: ['product', 'location', 'quantity', 'value'] }
                ]
              },
              isDefault: true,
              createdById: adminUser.id,
            }
          ]
        }
      }
    ];

    for (const report of reports) {
      await prisma.reportDefinition.create({
        data: report,
      });
    }

    console.log(`Created ${reports.length} system reports`);

    // Create default dashboard
    // Clear existing dashboards to avoid duplicates
    await prisma.dashboardWidget.deleteMany({
      where: {
        dashboard: {
          tenantId: defaultTenant.id,
        },
      },
    });
    
    await prisma.dashboard.deleteMany({
      where: {
        tenantId: defaultTenant.id,
      },
    });

    const dashboard = await prisma.dashboard.create({
      data: {
        dashboardName: 'Overview Dashboard',
        dashboardDescription: 'Main dashboard with key metrics',
        isSystemDashboard: true,
        isActive: true,
        tenantId: defaultTenant.id,
        createdById: adminUser.id,
        widgets: {
          create: [
            {
              widgetType: 'SALES_SUMMARY',
              widgetName: 'Recent Sales',
              widgetConfig: {
                period: '30days',
                showChart: true,
                chartType: 'line'
              },
              positionX: 0,
              positionY: 0,
              width: 2,
              height: 1,
            },
            {
              widgetType: 'INVENTORY_SUMMARY',
              widgetName: 'Inventory Status',
              widgetConfig: {
                showLowStock: true,
                showValue: true
              },
              positionX: 0,
              positionY: 1,
              width: 1,
              height: 1,
            },
            {
              widgetType: 'CUSTOMER_LIST',
              widgetName: 'Top Customers',
              widgetConfig: {
                limit: 5,
                sortBy: 'totalSpent',
                period: '90days'
              },
              positionX: 1,
              positionY: 1,
              width: 1,
              height: 1,
            }
          ]
        }
      }
    });

    console.log(`Created default dashboard: ${dashboard.dashboardName}`);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        tenants: 1,
        users: 3,
        locations: 2,
        products: products.length,
        customers: customers.length,
        vendors: vendors.length,
        inventoryRecords: inventoryRecords.length,
        sales: 2,
        reports: reports.length,
        dashboards: 1
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        error: { 
          code: 'SEED_ERROR', 
          message: 'Failed to seed database',
          details: error.message
        } 
      },
      { status: 500 }
    );
  }
}
