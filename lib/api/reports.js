/**
 * API utilities for reporting and analytics
 * 
 * This file provides functions for generating reports and analytics
 * through the database adapter.
 */

const db = require('../database');

/**
 * Generate sales performance report
 * @param {Object} options - Report options
 * @param {Date} options.startDate - Start date for report period
 * @param {Date} options.endDate - End date for report period
 * @param {string} options.groupBy - Group by option (day, week, month, quarter, year)
 * @param {Array} options.customerIds - Filter by customer IDs (optional)
 * @param {Array} options.productIds - Filter by product IDs (optional)
 * @returns {Promise<Object>} Sales performance report
 */
async function generateSalesPerformanceReport(options) {
  const { startDate, endDate, groupBy = 'month', customerIds, productIds } = options;
  
  // Get sales within date range
  let sales = await db.sales.findAll({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  // Apply customer filter if provided
  if (customerIds && customerIds.length > 0) {
    sales = sales.filter(sale => customerIds.includes(sale.customerId));
  }
  
  // Apply product filter if provided
  if (productIds && productIds.length > 0) {
    sales = sales.filter(sale => {
      return sale.items.some(item => productIds.includes(item.productId));
    });
  }
  
  // Group sales by time period
  const groupedSales = groupSalesByTimePeriod(sales, groupBy);
  
  // Calculate metrics
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = sales.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Get top products
  const productSales = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productId: item.productId,
          productName: item.productName,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.subtotal;
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  // Get top customers
  const customerSales = {};
  sales.forEach(sale => {
    if (!customerSales[sale.customerId]) {
      customerSales[sale.customerId] = {
        customerId: sale.customerId,
        customerName: sale.customerName,
        orderCount: 0,
        revenue: 0
      };
    }
    customerSales[sale.customerId].orderCount += 1;
    customerSales[sale.customerId].revenue += sale.total;
  });
  
  const topCustomers = Object.values(customerSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  return {
    timeRange: {
      startDate,
      endDate,
      groupBy
    },
    summary: {
      totalSales,
      totalOrders,
      averageOrderValue
    },
    salesByPeriod: groupedSales,
    topProducts,
    topCustomers
  };
}

/**
 * Generate inventory turnover report
 * @param {Object} options - Report options
 * @param {Date} options.startDate - Start date for report period
 * @param {Date} options.endDate - End date for report period
 * @param {Array} options.locationIds - Filter by location IDs (optional)
 * @param {Array} options.categoryIds - Filter by category IDs (optional)
 * @returns {Promise<Object>} Inventory turnover report
 */
async function generateInventoryTurnoverReport(options) {
  const { startDate, endDate, locationIds, categoryIds } = options;
  
  // Get inventory records
  let products = await db.products.findAll();
  
  // Apply category filter if provided
  if (categoryIds && categoryIds.length > 0) {
    products = products.filter(product => categoryIds.includes(product.categoryId));
  }
  
  // Get inventory transactions within date range
  let inventoryTransactions = await db.inventoryTransactions.findAll({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  // Apply location filter if provided
  if (locationIds && locationIds.length > 0) {
    inventoryTransactions = inventoryTransactions.filter(transaction => 
      locationIds.includes(transaction.locationId)
    );
  }
  
  // Calculate inventory turnover metrics
  const productMetrics = {};
  
  // Initialize product metrics
  products.forEach(product => {
    productMetrics[product.id] = {
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      category: product.category,
      beginningInventory: 0,
      endingInventory: product.quantity || 0,
      sold: 0,
      received: 0,
      turnoverRate: 0,
      daysOnHand: 0
    };
  });
  
  // Calculate beginning inventory (inventory at start date)
  const beginningInventoryTransactions = await db.inventoryTransactions.findAll({
    timestamp: {
      $lt: startDate
    }
  });
  
  // Group by product and calculate beginning inventory
  beginningInventoryTransactions.forEach(transaction => {
    if (productMetrics[transaction.productId]) {
      if (transaction.type === 'received') {
        productMetrics[transaction.productId].beginningInventory += transaction.quantity;
      } else if (transaction.type === 'sold' || transaction.type === 'adjustment') {
        productMetrics[transaction.productId].beginningInventory -= transaction.quantity;
      }
    }
  });
  
  // Process inventory transactions within date range
  inventoryTransactions.forEach(transaction => {
    if (productMetrics[transaction.productId]) {
      if (transaction.type === 'received') {
        productMetrics[transaction.productId].received += transaction.quantity;
      } else if (transaction.type === 'sold') {
        productMetrics[transaction.productId].sold += transaction.quantity;
      }
    }
  });
  
  // Calculate turnover rate and days on hand
  const daysBetween = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  
  Object.values(productMetrics).forEach(metric => {
    const averageInventory = (metric.beginningInventory + metric.endingInventory) / 2;
    
    // Avoid division by zero
    if (averageInventory > 0) {
      metric.turnoverRate = metric.sold / averageInventory;
      
      // Annualize turnover rate
      const annualizedTurnover = metric.turnoverRate * (365 / daysBetween);
      
      // Calculate days on hand (365 / annualized turnover)
      metric.daysOnHand = annualizedTurnover > 0 ? 365 / annualizedTurnover : 0;
    }
  });
  
  // Sort by turnover rate (descending)
  const sortedProducts = Object.values(productMetrics)
    .sort((a, b) => b.turnoverRate - a.turnoverRate);
  
  // Calculate category metrics
  const categoryMetrics = {};
  
  sortedProducts.forEach(product => {
    const category = product.category || 'Uncategorized';
    
    if (!categoryMetrics[category]) {
      categoryMetrics[category] = {
        category,
        productCount: 0,
        totalSold: 0,
        averageTurnoverRate: 0,
        averageDaysOnHand: 0
      };
    }
    
    categoryMetrics[category].productCount += 1;
    categoryMetrics[category].totalSold += product.sold;
    categoryMetrics[category].averageTurnoverRate += product.turnoverRate;
    categoryMetrics[category].averageDaysOnHand += product.daysOnHand;
  });
  
  // Calculate averages for categories
  Object.values(categoryMetrics).forEach(metric => {
    if (metric.productCount > 0) {
      metric.averageTurnoverRate /= metric.productCount;
      metric.averageDaysOnHand /= metric.productCount;
    }
  });
  
  return {
    timeRange: {
      startDate,
      endDate,
      days: daysBetween
    },
    summary: {
      totalProducts: sortedProducts.length,
      totalSold: sortedProducts.reduce((sum, product) => sum + product.sold, 0),
      averageTurnoverRate: sortedProducts.reduce((sum, product) => sum + product.turnoverRate, 0) / sortedProducts.length,
      averageDaysOnHand: sortedProducts.reduce((sum, product) => sum + product.daysOnHand, 0) / sortedProducts.length
    },
    productMetrics: sortedProducts,
    categoryMetrics: Object.values(categoryMetrics)
  };
}

/**
 * Generate customer behavior analysis report
 * @param {Object} options - Report options
 * @param {Date} options.startDate - Start date for report period
 * @param {Date} options.endDate - End date for report period
 * @param {Array} options.customerIds - Filter by customer IDs (optional)
 * @param {Array} options.segmentIds - Filter by segment IDs (optional)
 * @returns {Promise<Object>} Customer behavior report
 */
async function generateCustomerBehaviorReport(options) {
  const { startDate, endDate, customerIds, segmentIds } = options;
  
  // Get customers
  let customers = await db.customers.findAll();
  
  // Apply customer filter if provided
  if (customerIds && customerIds.length > 0) {
    customers = customers.filter(customer => customerIds.includes(customer.id));
  }
  
  // Apply segment filter if provided
  if (segmentIds && segmentIds.length > 0) {
    customers = customers.filter(customer => segmentIds.includes(customer.segmentId));
  }
  
  // Get sales within date range
  const sales = await db.sales.findAll({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  // Calculate customer metrics
  const customerMetrics = {};
  
  // Initialize customer metrics
  customers.forEach(customer => {
    customerMetrics[customer.id] = {
      customerId: customer.id,
      customerName: customer.name,
      customerCode: customer.code,
      segment: customer.segment || 'Uncategorized',
      orderCount: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      firstPurchaseDate: null,
      lastPurchaseDate: null,
      daysSinceLastPurchase: 0,
      purchaseFrequencyDays: 0,
      productCategories: {},
      paymentPerformance: {
        onTimePayments: 0,
        latePayments: 0,
        onTimeRate: 0
      }
    };
  });
  
  // Process sales data
  sales.forEach(sale => {
    if (customerMetrics[sale.customerId]) {
      const customer = customerMetrics[sale.customerId];
      
      // Update order count and total spent
      customer.orderCount += 1;
      customer.totalSpent += sale.total;
      
      // Update first and last purchase dates
      const saleDate = new Date(sale.createdAt);
      
      if (!customer.firstPurchaseDate || saleDate < new Date(customer.firstPurchaseDate)) {
        customer.firstPurchaseDate = sale.createdAt;
      }
      
      if (!customer.lastPurchaseDate || saleDate > new Date(customer.lastPurchaseDate)) {
        customer.lastPurchaseDate = sale.createdAt;
      }
      
      // Track product categories purchased
      sale.items.forEach(item => {
        const product = db.products.findById(item.productId);
        if (product && product.category) {
          if (!customer.productCategories[product.category]) {
            customer.productCategories[product.category] = 0;
          }
          customer.productCategories[product.category] += item.quantity;
        }
      });
      
      // Track payment performance
      if (sale.paymentStatus === 'paid') {
        const dueDate = new Date(sale.dueDate);
        const paymentDate = new Date(sale.paymentDate);
        
        if (paymentDate <= dueDate) {
          customer.paymentPerformance.onTimePayments += 1;
        } else {
          customer.paymentPerformance.latePayments += 1;
        }
      }
    }
  });
  
  // Calculate derived metrics
  const today = new Date();
  
  Object.values(customerMetrics).forEach(customer => {
    // Calculate average order value
    customer.averageOrderValue = customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 0;
    
    // Calculate days since last purchase
    if (customer.lastPurchaseDate) {
      const lastPurchaseDate = new Date(customer.lastPurchaseDate);
      customer.daysSinceLastPurchase = Math.floor((today - lastPurchaseDate) / (1000 * 60 * 60 * 24));
    }
    
    // Calculate purchase frequency (in days)
    if (customer.firstPurchaseDate && customer.lastPurchaseDate && customer.orderCount > 1) {
      const firstPurchaseDate = new Date(customer.firstPurchaseDate);
      const lastPurchaseDate = new Date(customer.lastPurchaseDate);
      const daysBetween = Math.floor((lastPurchaseDate - firstPurchaseDate) / (1000 * 60 * 60 * 24));
      customer.purchaseFrequencyDays = daysBetween / (customer.orderCount - 1);
    }
    
    // Calculate on-time payment rate
    const totalPayments = customer.paymentPerformance.onTimePayments + customer.paymentPerformance.latePayments;
    customer.paymentPerformance.onTimeRate = totalPayments > 0 
      ? (customer.paymentPerformance.onTimePayments / totalPayments) * 100 
      : 0;
    
    // Convert product categories to array
    customer.productCategories = Object.entries(customer.productCategories).map(([category, quantity]) => ({
      category,
      quantity
    })).sort((a, b) => b.quantity - a.quantity);
  });
  
  // Sort customers by total spent (descending)
  const sortedCustomers = Object.values(customerMetrics)
    .sort((a, b) => b.totalSpent - a.totalSpent);
  
  // Calculate segment metrics
  const segmentMetrics = {};
  
  sortedCustomers.forEach(customer => {
    const segment = customer.segment || 'Uncategorized';
    
    if (!segmentMetrics[segment]) {
      segmentMetrics[segment] = {
        segment,
        customerCount: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        averagePurchaseFrequency: 0,
        onTimePaymentRate: 0
      };
    }
    
    segmentMetrics[segment].customerCount += 1;
    segmentMetrics[segment].totalRevenue += customer.totalSpent;
    segmentMetrics[segment].averageOrderValue += customer.averageOrderValue;
    segmentMetrics[segment].averagePurchaseFrequency += customer.purchaseFrequencyDays;
    segmentMetrics[segment].onTimePaymentRate += customer.paymentPerformance.onTimeRate;
  });
  
  // Calculate averages for segments
  Object.values(segmentMetrics).forEach(metric => {
    if (metric.customerCount > 0) {
      metric.averageOrderValue /= metric.customerCount;
      metric.averagePurchaseFrequency /= metric.customerCount;
      metric.onTimePaymentRate /= metric.customerCount;
    }
  });
  
  return {
    timeRange: {
      startDate,
      endDate
    },
    summary: {
      totalCustomers: sortedCustomers.length,
      totalRevenue: sortedCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0),
      averageOrderValue: sortedCustomers.reduce((sum, customer) => sum + customer.averageOrderValue, 0) / sortedCustomers.length,
      averagePurchaseFrequency: sortedCustomers.reduce((sum, customer) => sum + customer.purchaseFrequencyDays, 0) / sortedCustomers.length
    },
    customerMetrics: sortedCustomers,
    segmentMetrics: Object.values(segmentMetrics)
  };
}

/**
 * Generate financial report
 * @param {Object} options - Report options
 * @param {Date} options.startDate - Start date for report period
 * @param {Date} options.endDate - End date for report period
 * @param {string} options.groupBy - Group by option (day, week, month, quarter, year)
 * @returns {Promise<Object>} Financial report
 */
async function generateFinancialReport(options) {
  const { startDate, endDate, groupBy = 'month' } = options;
  
  // Get sales within date range
  const sales = await db.sales.findAll({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  // Get purchase orders within date range
  const purchaseOrders = await db.purchaseOrders.findAll({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  // Group sales and purchases by time period
  const groupedSales = groupSalesByTimePeriod(sales, groupBy);
  const groupedPurchases = groupPurchasesByTimePeriod(purchaseOrders, groupBy);
  
  // Calculate revenue, cost, and profit by period
  const financialsByPeriod = {};
  
  // Initialize periods from sales
  Object.keys(groupedSales).forEach(period => {
    financialsByPeriod[period] = {
      period,
      revenue: groupedSales[period].total,
      cost: 0,
      profit: 0,
      margin: 0
    };
  });
  
  // Add periods from purchases if not already present
  Object.keys(groupedPurchases).forEach(period => {
    if (!financialsByPeriod[period]) {
      financialsByPeriod[period] = {
        period,
        revenue: 0,
        cost: 0,
        profit: 0,
        margin: 0
      };
    }
    
    financialsByPeriod[period].cost = groupedPurchases[period].total;
  });
  
  // Calculate profit and margin
  Object.values(financialsByPeriod).forEach(financial => {
    financial.profit = financial.revenue - financial.cost;
    financial.margin = financial.revenue > 0 ? (financial.profit / financial.revenue) * 100 : 0;
  });
  
  // Sort by period
  const sortedFinancials = Object.values(financialsByPeriod)
    .sort((a, b) => a.period.localeCompare(b.period));
  
  // Calculate totals
  const totalRevenue = sortedFinancials.reduce((sum, financial) => sum + financial.revenue, 0);
  const totalCost = sortedFinancials.reduce((sum, financial) => sum + financial.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Calculate accounts receivable
  const accountsReceivable = sales
    .filter(sale => sale.paymentStatus !== 'paid')
    .reduce((sum, sale) => {
      const amountDue = sale.total - (sale.amountPaid || 0);
      return sum + amountDue;
    }, 0);
  
  // Calculate accounts payable
  const accountsPayable = purchaseOrders
    .filter(po => po.paymentStatus !== 'paid')
    .reduce((sum, po) => {
      const amountDue = po.total - (po.amountPaid || 0);
      return sum + amountDue;
    }, 0);
  
  return {
    timeRange: {
      startDate,
      endDate,
      groupBy
    },
    summary: {
      totalRevenue,
      totalCost,
      totalProfit,
      overallMargin,
      accountsReceivable,
      accountsPayable
    },
    financialsByPeriod: sortedFinancials
  };
}

/**
 * Generate custom report
 * @param {Object} options - Report options
 * @param {Date} options.startDate - Start date for report period
 * @param {Date} options.endDate - End date for report period
 * @param {Array} options.metrics - Array of metrics to include
 * @param {Array} options.dimensions - Array of dimensions to group by
 * @param {Array} options.filters - Array of filters to apply
 * @returns {Promise<Object>} Custom report
 */
async function generateCustomReport(options) {
  const { startDate, endDate, metrics, dimensions, filters } = options;
  
  // Validate required parameters
  if (!metrics || metrics.length === 0) {
    throw new Error('At least one metric is required');
  }
  
  // Initialize report data
  const reportData = {
    timeRange: {
      startDate,
      endDate
    },
    dimensions,
    metrics,
    filters,
    data: []
  };
  
  // Get base data based on metrics
  let baseData = [];
  
  if (metrics.includes('sales') || metrics.includes('revenue') || metrics.includes('orders')) {
    const sales = await db.sales.findAll({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    baseData = [...baseData, ...sales.map(sale => ({
      type: 'sale',
      ...sale
    }))];
  }
  
  if (metrics.includes('purchases') || metrics.includes('cost')) {
    const purchases = await db.purchaseOrders.findAll({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    baseData = [...baseData, ...purchases.map(purchase => ({
      type: 'purchase',
      ...purchase
    }))];
  }
  
  if (metrics.includes('inventory') || metrics.includes('stock_levels')) {
    const products = await db.products.findAll();
    
    baseData = [...baseData, ...products.map(product => ({
      type: 'product',
      ...product
    }))];
  }
  
  // Apply filters
  if (filters && filters.length > 0) {
    filters.forEach(filter => {
      const { field, operator, value } = filter;
      
      baseData = baseData.filter(item => {
        const fieldValue = getNestedValue(item, field);
        
        switch (operator) {
          case 'equals':
            return fieldValue === value;
          case 'not_equals':
            return fieldValue !== value;
          case 'greater_than':
            return fieldValue > value;
          case 'less_than':
            return fieldValue < value;
          case 'contains':
            return String(fieldValue).includes(value);
          case 'not_contains':
            return !String(fieldValue).includes(value);
          case 'in':
            return Array.isArray(value) && value.includes(fieldValue);
          case 'not_in':
            return Array.isArray(value) && !value.includes(fieldValue);
          default:
            return true;
        }
      });
    });
  }
  
  // Group by dimensions
  if (dimensions && dimensions.length > 0) {
    const groupedData = {};
    
    baseData.forEach(item => {
      const dimensionKey = dimensions.map(dimension => {
        const value = getNestedValue(item, dimension) || 'Unknown';
        return `${dimension}:${value}`;
      }).join('|');
      
      if (!groupedData[dimensionKey]) {
        groupedData[dimensionKey] = {
          dimensions: dimensions.reduce((acc, dimension) => {
            acc[dimension] = getNestedValue(item, dimension) || 'Unknown';
            return acc;
          }, {}),
          metrics: {}
        };
      }
      
      // Calculate metrics
      metrics.forEach(metric => {
        switch (metric) {
          case 'sales':
          case 'revenue':
            if (item.type === 'sale') {
              groupedData[dimensionKey].metrics[metric] = (groupedData[dimensionKey].metrics[metric] || 0) + item.total;
            }
            break;
          case 'orders':
            if (item.type === 'sale') {
              groupedData[dimensionKey].metrics[metric] = (groupedData[dimensionKey].metrics[metric] || 0) + 1;
            }
            break;
          case 'purchases':
          case 'cost':
            if (item.type === 'purchase') {
              groupedData[dimensionKey].metrics[metric] = (groupedData[dimensionKey].metrics[metric] || 0) + item.total;
            }
            break;
          case 'inventory':
          case 'stock_levels':
            if (item.type === 'product') {
              groupedData[dimensionKey].metrics[metric] = (groupedData[dimensionKey].metrics[metric] || 0) + (item.quantity || 0);
            }
            break;
          case 'profit':
            if (item.type === 'sale') {
              groupedData[dimensionKey].metrics.revenue = (groupedData[dimensionKey].metrics.revenue || 0) + item.total;
            } else if (item.type === 'purchase') {
              groupedData[dimensionKey].metrics.cost = (groupedData[dimensionKey].metrics.cost || 0) + item.total;
            }
            groupedData[dimensionKey].metrics.profit = (groupedData[dimensionKey].metrics.revenue || 0) - (groupedData[dimensionKey].metrics.cost || 0);
            break;
          case 'margin':
            if (item.type === 'sale') {
              groupedData[dimensionKey].metrics.revenue = (groupedData[dimensionKey].metrics.revenue || 0) + item.total;
            } else if (item.type === 'purchase') {
              groupedData[dimensionKey].metrics.cost = (groupedData[dimensionKey].metrics.cost || 0) + item.total;
            }
            const revenue = groupedData[dimensionKey].metrics.revenue || 0;
            const cost = groupedData[dimensionKey].metrics.cost || 0;
            const profit = revenue - cost;
            groupedData[dimensionKey].metrics.margin = revenue > 0 ? (profit / revenue) * 100 : 0;
            break;
          default:
            // Custom metric calculation
            if (typeof item[metric] !== 'undefined') {
              groupedData[dimensionKey].metrics[metric] = (groupedData[dimensionKey].metrics[metric] || 0) + item[metric];
            }
        }
      });
    });
    
    reportData.data = Object.values(groupedData);
  } else {
    // No dimensions, calculate metrics for all data
    const aggregatedMetrics = {};
    
    // Calculate metrics
    metrics.forEach(metric => {
      switch (metric) {
        case 'sales':
        case 'revenue':
          aggregatedMetrics[metric] = baseData
            .filter(item => item.type === 'sale')
            .reduce((sum, item) => sum + item.total, 0);
          break;
        case 'orders':
          aggregatedMetrics[metric] = baseData
            .filter(item => item.type === 'sale')
            .length;
          break;
        case 'purchases':
        case 'cost':
          aggregatedMetrics[metric] = baseData
            .filter(item => item.type === 'purchase')
            .reduce((sum, item) => sum + item.total, 0);
          break;
        case 'inventory':
        case 'stock_levels':
          aggregatedMetrics[metric] = baseData
            .filter(item => item.type === 'product')
            .reduce((sum, item) => sum + (item.quantity || 0), 0);
          break;
        case 'profit':
          const revenue = baseData
            .filter(item => item.type === 'sale')
            .reduce((sum, item) => sum + item.total, 0);
          const cost = baseData
            .filter(item => item.type === 'purchase')
            .reduce((sum, item) => sum + item.total, 0);
          aggregatedMetrics[metric] = revenue - cost;
          break;
        case 'margin':
          const totalRevenue = baseData
            .filter(item => item.type === 'sale')
            .reduce((sum, item) => sum + item.total, 0);
          const totalCost = baseData
            .filter(item => item.type === 'purchase')
            .reduce((sum, item) => sum + item.total, 0);
          const totalProfit = totalRevenue - totalCost;
          aggregatedMetrics[metric] = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
          break;
        default:
          // Custom metric calculation
          aggregatedMetrics[metric] = baseData.reduce((sum, item) => {
            return sum + (typeof item[metric] !== 'undefined' ? item[metric] : 0);
          }, 0);
      }
    });
    
    reportData.data = [{ metrics: aggregatedMetrics }];
  }
  
  return reportData;
}

/**
 * Export report to CSV format
 * @param {Object} report - Report data
 * @returns {string} CSV formatted report
 */
function exportReportToCsv(report) {
  if (!report || !report.data || !Array.isArray(report.data)) {
    throw new Error('Invalid report data');
  }
  
  const rows = [];
  
  // Create header row
  const headerRow = [];
  
  // Add dimension headers if present
  if (report.dimensions && report.dimensions.length > 0) {
    headerRow.push(...report.dimensions);
  }
  
  // Add metric headers
  if (report.metrics && report.metrics.length > 0) {
    headerRow.push(...report.metrics);
  } else if (report.data.length > 0 && report.data[0].metrics) {
    headerRow.push(...Object.keys(report.data[0].metrics));
  }
  
  rows.push(headerRow.join(','));
  
  // Add data rows
  report.data.forEach(item => {
    const row = [];
    
    // Add dimension values if present
    if (report.dimensions && report.dimensions.length > 0 && item.dimensions) {
      report.dimensions.forEach(dimension => {
        row.push(item.dimensions[dimension] || '');
      });
    }
    
    // Add metric values
    if (report.metrics && report.metrics.length > 0) {
      report.metrics.forEach(metric => {
        row.push(item.metrics[metric] || 0);
      });
    } else if (item.metrics) {
      Object.values(item.metrics).forEach(value => {
        row.push(value || 0);
      });
    }
    
    rows.push(row.join(','));
  });
  
  return rows.join('\n');
}

/**
 * Export report to Excel format
 * @param {Object} report - Report data
 * @returns {Buffer} Excel formatted report
 */
function exportReportToExcel(report) {
  // This would typically use a library like exceljs or xlsx
  // For now, we'll return the CSV as a placeholder
  return Buffer.from(exportReportToCsv(report));
}

/**
 * Helper function to group sales by time period
 * @param {Array} sales - Array of sales
 * @param {string} groupBy - Group by option (day, week, month, quarter, year)
 * @returns {Object} Sales grouped by time period
 */
function groupSalesByTimePeriod(sales, groupBy) {
  const groupedSales = {};
  
  sales.forEach(sale => {
    const date = new Date(sale.createdAt);
    let period;
    
    switch (groupBy) {
      case 'day':
        period = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        period = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD of week start
        break;
      case 'month':
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        period = `${date.getFullYear()}-Q${quarter}`; // YYYY-Q#
        break;
      case 'year':
        period = `${date.getFullYear()}`; // YYYY
        break;
      default:
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Default to month
    }
    
    if (!groupedSales[period]) {
      groupedSales[period] = {
        period,
        count: 0,
        total: 0,
        items: 0
      };
    }
    
    groupedSales[period].count += 1;
    groupedSales[period].total += sale.total;
    groupedSales[period].items += sale.items.reduce((sum, item) => sum + item.quantity, 0);
  });
  
  return groupedSales;
}

/**
 * Helper function to group purchases by time period
 * @param {Array} purchases - Array of purchase orders
 * @param {string} groupBy - Group by option (day, week, month, quarter, year)
 * @returns {Object} Purchases grouped by time period
 */
function groupPurchasesByTimePeriod(purchases, groupBy) {
  const groupedPurchases = {};
  
  purchases.forEach(purchase => {
    const date = new Date(purchase.createdAt);
    let period;
    
    switch (groupBy) {
      case 'day':
        period = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        period = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD of week start
        break;
      case 'month':
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        period = `${date.getFullYear()}-Q${quarter}`; // YYYY-Q#
        break;
      case 'year':
        period = `${date.getFullYear()}`; // YYYY
        break;
      default:
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Default to month
    }
    
    if (!groupedPurchases[period]) {
      groupedPurchases[period] = {
        period,
        count: 0,
        total: 0,
        items: 0
      };
    }
    
    groupedPurchases[period].count += 1;
    groupedPurchases[period].total += purchase.total;
    groupedPurchases[period].items += purchase.items.reduce((sum, item) => sum + item.quantity, 0);
  });
  
  return groupedPurchases;
}

/**
 * Helper function to get nested value from object
 * @param {Object} obj - Object to get value from
 * @param {string} path - Path to value (e.g. 'customer.address.city')
 * @returns {*} Value at path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

module.exports = {
  generateSalesPerformanceReport,
  generateInventoryTurnoverReport,
  generateCustomerBehaviorReport,
  generateFinancialReport,
  generateCustomReport,
  exportReportToCsv,
  exportReportToExcel
};
