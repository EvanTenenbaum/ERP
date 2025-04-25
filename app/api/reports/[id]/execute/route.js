import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function POST(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_REPORTS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify report exists and belongs to tenant
    const report = await prisma.reportDefinition.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
        isActive: true,
      },
      include: {
        parameters: {
          orderBy: {
            parameterOrder: 'asc',
          },
        },
      },
    });
    
    if (!report) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Report with ID ${id} not found or is inactive`,
            details: { resourceType: 'report', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Get parameter values from request
    const data = await request.json();
    const { parameterValues, outputFormat = 'JSON' } = data;
    
    // Validate required parameters
    const missingParams = [];
    for (const param of report.parameters) {
      if (param.isRequired && (!parameterValues || parameterValues[param.parameterName] === undefined)) {
        missingParams.push(param.parameterName);
      }
    }
    
    if (missingParams.length > 0) {
      return NextResponse.json(
        { 
          error: { 
            code: 'MISSING_PARAMETERS', 
            message: 'Required parameters are missing',
            details: { missingParameters: missingParams }
          } 
        },
        { status: 400 }
      );
    }
    
    // Create execution record
    const execution = await prisma.reportExecutionHistory.create({
      data: {
        reportId: id,
        userId: session.user.id,
        executionStart: new Date(),
        status: 'Running',
        parameterValues: parameterValues || {},
      },
    });
    
    // Execute report based on report type
    let reportData;
    let error = null;
    
    try {
      switch (report.reportType) {
        case 'SalesSummary':
          reportData = await generateSalesSummaryReport(session.user.tenantId, parameterValues);
          break;
        case 'InventorySummary':
          reportData = await generateInventorySummaryReport(session.user.tenantId, parameterValues);
          break;
        case 'CustomerAnalytics':
          reportData = await generateCustomerAnalyticsReport(session.user.tenantId, parameterValues);
          break;
        case 'VendorPerformance':
          reportData = await generateVendorPerformanceReport(session.user.tenantId, parameterValues);
          break;
        case 'FinancialSummary':
          reportData = await generateFinancialSummaryReport(session.user.tenantId, parameterValues);
          break;
        default:
          throw new Error(`Unsupported report type: ${report.reportType}`);
      }
    } catch (err) {
      error = err;
      console.error(`Error executing report ${id}:`, err);
    }
    
    // Update execution record
    await prisma.reportExecutionHistory.update({
      where: {
        id: execution.id,
      },
      data: {
        executionEnd: new Date(),
        status: error ? 'Failed' : 'Success',
        errorMessage: error ? error.message : null,
      },
    });
    
    if (error) {
      return NextResponse.json(
        { 
          error: { 
            code: 'REPORT_EXECUTION_FAILED', 
            message: 'Failed to execute report',
            details: { error: error.message }
          } 
        },
        { status: 500 }
      );
    }
    
    // Return report data
    return NextResponse.json({
      executionId: execution.id,
      reportName: report.reportName,
      executionTime: new Date(),
      parameters: parameterValues || {},
      data: reportData,
    });
  } catch (error) {
    console.error('Error executing report:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

// Report generation functions
async function generateSalesSummaryReport(tenantId, parameters) {
  const { startDate, endDate, groupBy = 'day' } = parameters;
  
  // Parse dates
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
  const end = endDate ? new Date(endDate) : new Date();
  
  // Query sales data
  const sales = await prisma.sale.findMany({
    where: {
      tenantId,
      saleDate: {
        gte: start,
        lte: end,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      saleItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              strainType: true,
            },
          },
        },
      },
    },
  });
  
  // Process data based on groupBy parameter
  let groupedData;
  
  switch (groupBy) {
    case 'day':
      groupedData = groupSalesByDay(sales);
      break;
    case 'week':
      groupedData = groupSalesByWeek(sales);
      break;
    case 'month':
      groupedData = groupSalesByMonth(sales);
      break;
    case 'customer':
      groupedData = groupSalesByCustomer(sales);
      break;
    case 'product':
      groupedData = groupSalesByProduct(sales);
      break;
    case 'category':
      groupedData = groupSalesByCategory(sales);
      break;
    default:
      groupedData = groupSalesByDay(sales);
  }
  
  // Calculate summary metrics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  return {
    summary: {
      totalSales,
      totalRevenue,
      averageOrderValue,
      startDate: start,
      endDate: end,
    },
    groupedData,
  };
}

async function generateInventorySummaryReport(tenantId, parameters) {
  const { locationId, category, lowStock = false } = parameters;
  
  // Build query
  const where = {
    tenantId,
    ...(locationId && { locationId }),
    ...(category && { 
      product: {
        category,
      },
    }),
    ...(lowStock && {
      quantity: {
        lt: 10, // Example threshold for low stock
      },
    }),
  };
  
  // Query inventory data
  const inventory = await prisma.inventoryRecord.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: true,
          strainType: true,
          wholesalePrice: true,
        },
      },
      location: true,
    },
  });
  
  // Calculate total inventory value
  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.quantity * (item.product.wholesalePrice || 0));
  }, 0);
  
  // Group by category
  const byCategory = {};
  inventory.forEach(item => {
    const category = item.product.category || 'uncategorized';
    if (!byCategory[category]) {
      byCategory[category] = {
        count: 0,
        quantity: 0,
        value: 0,
      };
    }
    
    byCategory[category].count++;
    byCategory[category].quantity += item.quantity;
    byCategory[category].value += item.quantity * (item.product.wholesalePrice || 0);
  });
  
  return {
    summary: {
      totalItems: inventory.length,
      totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
      totalValue,
      lowStockItems: inventory.filter(item => item.quantity < 10).length,
    },
    byCategory,
    items: inventory.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      category: item.product.category,
      strainType: item.product.strainType,
      location: item.location.name,
      quantity: item.quantity,
      value: item.quantity * (item.product.wholesalePrice || 0),
      isLowStock: item.quantity < 10,
    })),
  };
}

async function generateCustomerAnalyticsReport(tenantId, parameters) {
  const { period = 'all', topCount = 10 } = parameters;
  
  // Determine date range based on period
  let startDate;
  const endDate = new Date();
  
  switch (period) {
    case '30days':
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90days':
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 90);
      break;
    case 'year':
      startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
  }
  
  // Get customers with their sales
  const customers = await prisma.customer.findMany({
    where: {
      tenantId,
    },
    include: {
      sales: {
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
  });
  
  // Calculate metrics for each customer
  const customerMetrics = customers.map(customer => {
    const totalSpent = customer.sales.reduce((sum, sale) => sum + sale.total, 0);
    const orderCount = customer.sales.length;
    const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
    
    // Find most recent purchase
    let lastPurchaseDate = null;
    if (orderCount > 0) {
      lastPurchaseDate = customer.sales.reduce((latest, sale) => {
        return sale.saleDate > latest ? sale.saleDate : latest;
      }, customer.sales[0].saleDate);
    }
    
    return {
      id: customer.id,
      name: customer.name,
      code: customer.code,
      email: customer.email,
      phone: customer.phone,
      totalSpent,
      orderCount,
      averageOrderValue,
      lastPurchaseDate,
      daysSinceLastPurchase: lastPurchaseDate ? 
        Math.floor((endDate - lastPurchaseDate) / (1000 * 60 * 60 * 24)) : 
        null,
    };
  });
  
  // Sort by total spent and get top customers
  const topCustomers = [...customerMetrics]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, topCount);
  
  // Calculate overall metrics
  const totalCustomers = customers.length;
  const totalRevenue = customerMetrics.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = customerMetrics.reduce((sum, customer) => sum + customer.orderCount, 0);
  const averageRevenuePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  
  return {
    summary: {
      totalCustomers,
      totalRevenue,
      totalOrders,
      averageRevenuePerCustomer,
      period,
      startDate,
      endDate,
    },
    topCustomers,
    customers: customerMetrics,
  };
}

async function generateVendorPerformanceReport(tenantId, parameters) {
  // Implementation for vendor performance report
  return {
    summary: {
      message: "Vendor performance report implementation pending"
    }
  };
}

async function generateFinancialSummaryReport(tenantId, parameters) {
  // Implementation for financial summary report
  return {
    summary: {
      message: "Financial summary report implementation pending"
    }
  };
}

// Helper functions for grouping sales data
function groupSalesByDay(sales) {
  const grouped = {};
  
  sales.forEach(sale => {
    const date = sale.saleDate.toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = {
        count: 0,
        total: 0,
        items: 0,
      };
    }
    
    grouped[date].count++;
    grouped[date].total += sale.total;
    grouped[date].items += sale.saleItems.length;
  });
  
  return Object.entries(grouped).map(([date, data]) => ({
    date,
    ...data,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

function groupSalesByWeek(sales) {
  // Implementation for grouping by week
  return [];
}

function groupSalesByMonth(sales) {
  // Implementation for grouping by month
  return [];
}

function groupSalesByCustomer(sales) {
  // Implementation for grouping by customer
  return [];
}

function groupSalesByProduct(sales) {
  // Implementation for grouping by product
  return [];
}

function groupSalesByCategory(sales) {
  // Implementation for grouping by category
  return [];
}
