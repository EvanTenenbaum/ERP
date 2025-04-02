"use client";

import React, { useState } from 'react';
import Button from '../../ui/Button'; // Fixed import path

export default function ReportViewer({ reportType }) {
  const [timeRange, setTimeRange] = useState('month');
  
  // Sample report data - in a real application, this would come from an API
  const reportData = {
    salesSummary: {
      totalSales: '$24,380.50',
      totalOrders: '142',
      averageOrderValue: '$171.69',
      monthlyGrowth: '+1.7%',
      topSellingProducts: [
        { name: 'Product A', quantity: 78, revenue: '$7,839.22' },
        { name: 'Product B', quantity: 64, revenue: '$3,199.36' },
        { name: 'Product C', quantity: 52, revenue: '$5,199.48' },
        { name: 'Product D', quantity: 45, revenue: '$899.55' },
        { name: 'Product E', quantity: 38, revenue: '$379.62' },
      ],
      salesByCategory: [
        { category: 'Category 1', amount: '$12,540.25', percentage: '51.4%' },
        { category: 'Category 2', amount: '$5,320.75', percentage: '21.8%' },
        { category: 'Category 3', amount: '$3,680.50', percentage: '15.1%' },
        { category: 'Category 4', amount: '$2,839.00', percentage: '11.7%' },
      ]
    },
    salesByProduct: {
      products: [
        { name: 'Product A', sales: '$7,839.22', units: 78, profit: '$2,351.77' },
        { name: 'Product B', sales: '$3,199.36', units: 64, profit: '$959.81' },
        { name: 'Product C', sales: '$5,199.48', units: 52, profit: '$1,559.84' },
        { name: 'Product D', sales: '$899.55', units: 45, profit: '$269.87' },
        { name: 'Product E', sales: '$379.62', units: 38, profit: '$113.89' },
        { name: 'Product F', sales: '$1,839.22', units: 32, profit: '$551.77' },
        { name: 'Product G', sales: '$1,199.36', units: 28, profit: '$359.81' },
        { name: 'Product H', sales: '$2,199.48', units: 24, profit: '$659.84' },
        { name: 'Product I', sales: '$599.55', units: 20, profit: '$179.87' },
        { name: 'Product J', sales: '$279.62', units: 18, profit: '$83.89' },
      ]
    },
    salesTrends: {
      monthly: [
        { month: 'Jan', amount: '$18,240.50' },
        { month: 'Feb', amount: '$21,350.75' },
        { month: 'Mar', amount: '$23,980.25' },
        { month: 'Apr', amount: '$24,380.50' },
      ],
      weekly: [
        { week: 'Week 1', amount: '$5,240.50' },
        { week: 'Week 2', amount: '$6,350.75' },
        { week: 'Week 3', amount: '$5,980.25' },
        { week: 'Week 4', amount: '$6,809.00' },
      ]
    },
    inventoryStatus: {
      totalItems: 1245,
      lowStock: 32,
      outOfStock: 8,
      locations: [
        { name: 'Warehouse A', items: 745, value: '$124,580.00' },
        { name: 'Warehouse B', items: 320, value: '$78,350.00' },
        { name: 'Warehouse C', items: 180, value: '$42,670.00' },
      ],
      categories: [
        { name: 'Category 1', items: 520, value: '$98,760.00' },
        { name: 'Category 2', items: 380, value: '$72,450.00' },
        { name: 'Category 3', items: 245, value: '$46,390.00' },
        { name: 'Category 4', items: 100, value: '$28,000.00' },
      ]
    },
    inventoryMovement: {
      received: 245,
      shipped: 312,
      returned: 18,
      adjusted: 7,
      topMovers: [
        { name: 'Product A', received: 45, shipped: 78 },
        { name: 'Product B', received: 38, shipped: 64 },
        { name: 'Product C', received: 32, shipped: 52 },
        { name: 'Product D', received: 28, shipped: 45 },
        { name: 'Product E', received: 24, shipped: 38 },
      ]
    },
    locationAnalysis: {
      locations: [
        { 
          name: 'Warehouse A', 
          totalItems: 745, 
          categories: [
            { name: 'Category 1', items: 320 },
            { name: 'Category 2', items: 180 },
            { name: 'Category 3', items: 145 },
            { name: 'Category 4', items: 100 },
          ]
        },
        { 
          name: 'Warehouse B', 
          totalItems: 320, 
          categories: [
            { name: 'Category 1', items: 120 },
            { name: 'Category 2', items: 100 },
            { name: 'Category 3', items: 60 },
            { name: 'Category 4', items: 40 },
          ]
        },
        { 
          name: 'Warehouse C', 
          totalItems: 180, 
          categories: [
            { name: 'Category 1', items: 80 },
            { name: 'Category 2', items: 60 },
            { name: 'Category 3', items: 40 },
            { name: 'Category 4', items: 0 },
          ]
        },
      ]
    },
    customerActivity: {
      totalCustomers: 87,
      activeCustomers: 64,
      newCustomers: 12,
      topCustomers: [
        { name: 'Customer A', orders: 24, value: '$8,750.00' },
        { name: 'Customer B', orders: 18, value: '$6,320.00' },
        { name: 'Customer C', orders: 15, value: '$5,980.00' },
        { name: 'Customer D', orders: 12, value: '$4,250.00' },
        { name: 'Customer E', orders: 10, value: '$3,780.00' },
      ]
    },
    paymentHistory: {
      totalReceived: '$145,780.00',
      outstanding: '$32,450.00',
      overdue: '$8,750.00',
      paymentMethods: [
        { method: 'Credit Card', amount: '$78,420.00', percentage: '53.8%' },
        { method: 'Bank Transfer', amount: '$45,360.00', percentage: '31.1%' },
        { method: 'Cash', amount: '$12,000.00', percentage: '8.2%' },
        { method: 'Other', amount: '$10,000.00', percentage: '6.9%' },
      ],
      recentPayments: [
        { customer: 'Customer A', date: '2023-04-01', amount: '$2,450.00', status: 'Completed' },
        { customer: 'Customer B', date: '2023-03-28', amount: '$1,780.00', status: 'Completed' },
        { customer: 'Customer C', date: '2023-03-25', amount: '$3,200.00', status: 'Completed' },
        { customer: 'Customer D', date: '2023-03-22', amount: '$950.00', status: 'Completed' },
        { customer: 'Customer E', date: '2023-03-20', amount: '$1,200.00', status: 'Completed' },
      ]
    },
    creditRecommendations: {
      customers: [
        { name: 'Customer A', currentCredit: '$10,000.00', recommendedCredit: '$15,000.00', riskLevel: 'Low' },
        { name: 'Customer B', currentCredit: '$8,000.00', recommendedCredit: '$10,000.00', riskLevel: 'Low' },
        { name: 'Customer C', currentCredit: '$5,000.00', recommendedCredit: '$7,500.00', riskLevel: 'Medium' },
        { name: 'Customer D', currentCredit: '$3,000.00', recommendedCredit: '$3,000.00', riskLevel: 'Medium' },
        { name: 'Customer E', currentCredit: '$2,000.00', recommendedCredit: '$1,000.00', riskLevel: 'High' },
      ]
    },
    salesByCustomer: {
      customers: [
        { name: 'Customer A', sales: 28750, orders: 24 },
        { name: 'Customer B', sales: 19320, orders: 18 },
        { name: 'Customer C', sales: 15980, orders: 15 },
        { name: 'Customer D', sales: 12250, orders: 12 },
        { name: 'Customer E', sales: 9780, orders: 10 }
      ]
    }
  };
  
  const renderReport = () => {
    switch(reportType) {
      case 'sales-summary':
        return renderSalesSummary();
      case 'sales-by-product':
        return renderSalesByProduct();
      case 'sales-trends':
        return renderSalesTrends();
      case 'inventory-status':
        return renderInventoryStatus();
      case 'inventory-movement':
        return renderInventoryMovement();
      case 'location-analysis':
        return renderLocationAnalysis();
      case 'customer-activity':
        return renderCustomerActivity();
      case 'payment-history':
        return renderPaymentHistory();
      case 'credit-recommendations':
        return renderCreditRecommendations();
      default:
        return <div>Select a report to view</div>;
    }
  };
  
  const renderSalesSummary = () => {
    const data = reportData.salesSummary;
    return (
      <div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{data.totalSales}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{data.totalOrders}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{data.averageOrderValue}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Growth</h3>
            <p className="mt-1 text-2xl font-semibold text-green-600">{data.monthlyGrowth}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Product</th>
                    <th className="table-header-cell">Quantity</th>
                    <th className="table-header-cell">Revenue</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {data.topSellingProducts.map((product, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="table-cell">{product.quantity}</td>
                      <td className="table-cell">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales by Category</h3>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Category</th>
                    <th className="table-header-cell">Amount</th>
                    <th className="table-header-cell">Percentage</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {data.salesByCategory.map((category, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell font-medium text-gray-900 dark:text-white">{category.category}</td>
                      <td className="table-cell">{category.amount}</td>
                      <td className="table-cell">{category.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSalesByProduct = () => {
    const data = reportData.salesByProduct;
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales by Product</h3>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Product</th>
                <th className="table-header-cell">Sales</th>
                <th className="table-header-cell">Units</th>
                <th className="table-header-cell">Profit</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {data.products.map((product, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="table-cell">{product.sales}</td>
                  <td className="table-cell">{product.units}</td>
                  <td className="table-cell">{product.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderSalesTrends = () => {
    const data = timeRange === 'month' ? reportData.salesTrends.monthly : reportData.salesTrends.weekly;
    
    return (
      <div>
        <div className="mb-4">
          <label className="form-label">Time Range</label>
          <select 
            className="form-input w-48"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">Monthly</option>
            <option value="week">Weekly</option>
          </select>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {timeRange === 'month' ? 'Monthly' : 'Weekly'} Sales Trend
          </h3>
          <div className="h-64 flex items-end justify-between px-4">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-primary-500 w-16 rounded-t-md" 
                  style={{ 
                    height: `${(parseFloat(item.amount.replace('$', '').replace(',', '')) / 30000) * 100}%` 
                  }}
                ></div>
                <div className="mt-2 text-sm text-gray-500">{timeRange === 'month' ? item.month : item.week}</div>
                <div className="text-xs text-gray-500">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderInventoryStatus = () => {
    const data = reportData.inventoryStatus;
    return (
      <div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{data.totalItems}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Items</h3>
            <p className="mt-1 text-2xl font-semibold text-yellow-600">{data.lowStock}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Out of Stock Items</h3>
            <p className="mt-1 text-2xl font-semibold text-red-600">{data.outOfStock}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Inventory by Location</h3>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Location</th>
                    <th className="table-header-cell">Items</th>
                    <th className="table-header-cell">Value</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {data.locations.map((location, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell font-medium text-gray-900 dark:text-white">{location.name}</td>
                      <td className="table-cell">{location.items}</td>
                      <td className
(Content truncated due to size limit. Use line ranges to read in chunks)