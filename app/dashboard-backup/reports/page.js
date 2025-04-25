'use client';

import React, { useState, useEffect } from 'react';
import { useReports } from '@/lib/hooks/useReports';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { useInventory } from '@/lib/hooks/useInventory';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { DownloadIcon, FilterIcon, RefreshCw } from 'lucide-react';

// Chart color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0], // 3 months ago
    endDate: new Date().toISOString().split('T')[0], // today
  });
  const [groupBy, setGroupBy] = useState('month');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    customers: [],
    products: [],
    categories: [],
    locations: [],
  });
  
  const { 
    loading, 
    error, 
    salesReport, 
    inventoryReport, 
    customerReport, 
    financialReport,
    generateSalesReport,
    generateInventoryReport,
    generateCustomerReport,
    generateFinancialReport,
    exportReport,
    downloadExport,
  } = useReports();
  
  const { customers } = useCustomers();
  const { products, categories, locations } = useInventory();
  
  // Generate initial reports on mount
  useEffect(() => {
    if (activeTab === 'sales') {
      handleGenerateSalesReport();
    } else if (activeTab === 'inventory') {
      handleGenerateInventoryReport();
    } else if (activeTab === 'customers') {
      handleGenerateCustomerReport();
    } else if (activeTab === 'financial') {
      handleGenerateFinancialReport();
    }
  }, [activeTab]);
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFilters(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };
  
  // Generate sales report
  const handleGenerateSalesReport = async () => {
    const options = {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
      groupBy,
      customerIds: filters.customers.length > 0 ? filters.customers : undefined,
      productIds: filters.products.length > 0 ? filters.products : undefined,
    };
    
    await generateSalesReport(options);
  };
  
  // Generate inventory report
  const handleGenerateInventoryReport = async () => {
    const options = {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
      locationIds: filters.locations.length > 0 ? filters.locations : undefined,
      categoryIds: filters.categories.length > 0 ? filters.categories : undefined,
    };
    
    await generateInventoryReport(options);
  };
  
  // Generate customer report
  const handleGenerateCustomerReport = async () => {
    const options = {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
      customerIds: filters.customers.length > 0 ? filters.customers : undefined,
    };
    
    await generateCustomerReport(options);
  };
  
  // Generate financial report
  const handleGenerateFinancialReport = async () => {
    const options = {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
      groupBy,
    };
    
    await generateFinancialReport(options);
  };
  
  // Handle export
  const handleExport = async (format) => {
    let report;
    let filename;
    
    if (activeTab === 'sales') {
      report = salesReport;
      filename = 'sales_performance_report';
    } else if (activeTab === 'inventory') {
      report = inventoryReport;
      filename = 'inventory_turnover_report';
    } else if (activeTab === 'customers') {
      report = customerReport;
      filename = 'customer_behavior_report';
    } else if (activeTab === 'financial') {
      report = financialReport;
      filename = 'financial_report';
    }
    
    if (report) {
      await exportReport(report, format);
      downloadExport(`${filename}_${new Date().toISOString().split('T')[0]}`);
    }
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleExport('csv')}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleExport('excel')}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'sales' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales Performance
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'inventory' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Turnover
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'customers' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customer Behavior
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'financial' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('financial')}
          >
            Financial Reports
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className={`mb-6 bg-gray-50 p-4 rounded-lg ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>
        
        {(activeTab === 'sales' || activeTab === 'customers') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customers
            </label>
            <select
              name="customers"
              multiple
              size={3}
              className="w-full p-2 border rounded"
              onChange={handleFilterChange}
            >
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        )}
        
        {(activeTab === 'sales' || activeTab === 'inventory') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Products
            </label>
            <select
              name="products"
              multiple
              size={3}
              className="w-full p-2 border rounded"
              onChange={handleFilterChange}
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <select
                name="categories"
                multiple
                size={3}
                className="w-full p-2 border rounded"
                onChange={handleFilterChange}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locations
              </label>
              <select
                name="locations"
                multiple
                size={3}
                className="w-full p-2 border rounded"
                onChange={handleFilterChange}
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={() => {
              if (activeTab === 'sales') {
                handleGenerateSalesReport();
              } else if (activeTab === 'inventory') {
                handleGenerateInventoryReport();
              } else if (activeTab === 'customers') {
                handleGenerateCustomerReport();
              } else if (activeTab === 'financial') {
                handleGenerateFinancialReport();
              }
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Sales Performance Report */}
      {activeTab === 'sales' && salesReport && !loading && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Total Sales</h3>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(salesReport.summary.totalSales)}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {formatDate(salesReport.timeRange.startDate)} - {formatDate(salesReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-green-900">{salesReport.summary.totalOrders}</p>
                <p className="text-sm text-green-700 mt-1">
                  {formatDate(salesReport.timeRange.startDate)} - {formatDate(salesReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Average Order Value</h3>
                <p className="text-3xl font-bold text-purple-900">{formatCurrency(salesReport.summary.averageOrderValue)}</p>
                <p className="text-sm text-purple-700 mt-1">
                  {formatDate(salesReport.timeRange.startDate)} - {formatDate(salesReport.timeRange.endDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={Object.values(salesReport.salesByPeriod)}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="total" name="Sales" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Top Products</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesReport.topProducts}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="productName" type="category" width={150} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#0088FE">
                      {salesReport.topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesReport.topCustomers}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="customerName" type="category" width={150} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#00C49F">
                      {salesReport.topCustomers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Inventory Turnover Report */}
      {activeTab === 'inventory' && inventoryReport && !loading && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Inventory Turnover Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Total Products</h3>
                <p className="text-3xl font-bold text-blue-900">{inventoryReport.summary.totalProducts}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {formatDate(inventoryReport.timeRange.startDate)} - {formatDate(inventoryReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Total Sold</h3>
                <p className="text-3xl font-bold text-green-900">{inventoryReport.summary.totalSold}</p>
                <p className="text-sm text-green-700 mt-1">
                  {formatDate(inventoryReport.timeRange.startDate)} - {formatDate(inventoryReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Avg. Turnover Rate</h3>
                <p className="text-3xl font-bold text-purple-900">{inventoryReport.summary.averageTurnoverRate.toFixed(2)}</p>
                <p className="text-sm text-purple-700 mt-1">
                  {formatDate(inventoryReport.timeRange.startDate)} - {formatDate(inventoryReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Avg. Days on Hand</h3>
                <p className="text-3xl font-bold text-yellow-900">{inventoryReport.summary.averageDaysOnHand.toFixed(1)}</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {formatDate(inventoryReport.timeRange.startDate)} - {formatDate(inventoryReport.timeRange.endDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Category Turnover Analysis</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventoryReport.categoryMetrics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="averageTurnoverRate" name="Turnover Rate" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="averageDaysOnHand" name="Days on Hand" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Top Products by Turnover Rate</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">Category</th>
                    <th className="py-2 px-4 border-b">Beginning Inventory</th>
                    <th className="py-2 px-4 border-b">Ending Inventory</th>
                    <th className="py-2 px-4 border-b">Sold</th>
                    <th className="py-2 px-4 border-b">Received</th>
                    <th className="py-2 px-4 border-b">Turnover Rate</th>
                    <th className="py-2 px-4 border-b">Days on Hand</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryReport.productMetrics.slice(0, 10).map((product, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{product.productName}</td>
                      <td className="py-2 px-4 border-b">{product.category}</td>
                      <td className="py-2 px-4 border-b">{product.beginningInventory}</td>
                      <td className="py-2 px-4 border-b">{product.endingInventory}</td>
                      <td className="py-2 px-4 border-b">{product.sold}</td>
                      <td className="py-2 px-4 border-b">{product.received}</td>
                      <td className="py-2 px-4 border-b">{product.turnoverRate.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{product.daysOnHand.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Customer Behavior Report */}
      {activeTab === 'customers' && customerReport && !loading && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Behavior Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Total Customers</h3>
                <p className="text-3xl font-bold text-blue-900">{customerReport.summary.totalCustomers}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {formatDate(customerReport.timeRange.startDate)} - {formatDate(customerReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(customerReport.summary.totalRevenue)}</p>
                <p className="text-sm text-green-700 mt-1">
                  {formatDate(customerReport.timeRange.startDate)} - {formatDate(customerReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Avg. Order Value</h3>
                <p className="text-3xl font-bold text-purple-900">{formatCurrency(customerReport.summary.averageOrderValue)}</p>
                <p className="text-sm text-purple-700 mt-1">
                  {formatDate(customerReport.timeRange.startDate)} - {formatDate(customerReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Avg. Purchase Frequency</h3>
                <p className="text-3xl font-bold text-yellow-900">{customerReport.summary.averagePurchaseFrequency.toFixed(1)} days</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {formatDate(customerReport.timeRange.startDate)} - {formatDate(customerReport.timeRange.endDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Segments</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerReport.segmentMetrics}
                      dataKey="totalRevenue"
                      nameKey="segment"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerReport.segmentMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Performance</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customerReport.segmentMetrics}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                    <Bar dataKey="onTimePaymentRate" name="On-Time Payment Rate" fill="#00C49F">
                      {customerReport.segmentMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Customer</th>
                    <th className="py-2 px-4 border-b">Segment</th>
                    <th className="py-2 px-4 border-b">Orders</th>
                    <th className="py-2 px-4 border-b">Total Spent</th>
                    <th className="py-2 px-4 border-b">Avg. Order Value</th>
                    <th className="py-2 px-4 border-b">Purchase Frequency</th>
                    <th className="py-2 px-4 border-b">Last Purchase</th>
                    <th className="py-2 px-4 border-b">On-Time Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {customerReport.customerMetrics.slice(0, 10).map((customer, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{customer.customerName}</td>
                      <td className="py-2 px-4 border-b">{customer.segment}</td>
                      <td className="py-2 px-4 border-b">{customer.orderCount}</td>
                      <td className="py-2 px-4 border-b">{formatCurrency(customer.totalSpent)}</td>
                      <td className="py-2 px-4 border-b">{formatCurrency(customer.averageOrderValue)}</td>
                      <td className="py-2 px-4 border-b">{customer.purchaseFrequencyDays.toFixed(1)} days</td>
                      <td className="py-2 px-4 border-b">{formatDate(customer.lastPurchaseDate)}</td>
                      <td className="py-2 px-4 border-b">{formatPercentage(customer.paymentPerformance.onTimeRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Financial Report */}
      {activeTab === 'financial' && financialReport && !loading && (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(financialReport.summary.totalRevenue)}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {formatDate(financialReport.timeRange.startDate)} - {formatDate(financialReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">Total Cost</h3>
                <p className="text-3xl font-bold text-red-900">{formatCurrency(financialReport.summary.totalCost)}</p>
                <p className="text-sm text-red-700 mt-1">
                  {formatDate(financialReport.timeRange.startDate)} - {formatDate(financialReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Total Profit</h3>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(financialReport.summary.totalProfit)}</p>
                <p className="text-sm text-green-700 mt-1">
                  {formatDate(financialReport.timeRange.startDate)} - {formatDate(financialReport.timeRange.endDate)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Overall Margin</h3>
                <p className="text-3xl font-bold text-purple-900">{formatPercentage(financialReport.summary.overallMargin)}</p>
                <p className="text-sm text-purple-700 mt-1">
                  {formatDate(financialReport.timeRange.startDate)} - {formatDate(financialReport.timeRange.endDate)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Accounts Receivable</h3>
                <p className="text-3xl font-bold text-yellow-900">{formatCurrency(financialReport.summary.accountsReceivable)}</p>
                <p className="text-sm text-yellow-700 mt-1">Outstanding customer payments</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-orange-800 mb-2">Accounts Payable</h3>
                <p className="text-3xl font-bold text-orange-900">{formatCurrency(financialReport.summary.accountsPayable)}</p>
                <p className="text-sm text-orange-700 mt-1">Outstanding vendor payments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue, Cost & Profit Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialReport.financialsByPeriod}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="cost" name="Cost" stroke="#ff8042" />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profit Margin Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialReport.financialsByPeriod}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="margin" name="Profit Margin %" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Details by Period</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Period</th>
                    <th className="py-2 px-4 border-b">Revenue</th>
                    <th className="py-2 px-4 border-b">Cost</th>
                    <th className="py-2 px-4 border-b">Profit</th>
                    <th className="py-2 px-4 border-b">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {financialReport.financialsByPeriod.map((financial, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{financial.period}</td>
                      <td className="py-2 px-4 border-b">{formatCurrency(financial.revenue)}</td>
                      <td className="py-2 px-4 border-b">{formatCurrency(financial.cost)}</td>
                      <td className="py-2 px-4 border-b">{formatCurrency(financial.profit)}</td>
                      <td className="py-2 px-4 border-b">{formatPercentage(financial.margin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* No Report Selected */}
      {!loading && !error && (
        (activeTab === 'sales' && !salesReport) ||
        (activeTab === 'inventory' && !inventoryReport) ||
        (activeTab === 'customers' && !customerReport) ||
        (activeTab === 'financial' && !financialReport)
      ) && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No report data available. Generate a report to view analytics.</p>
          <Button 
            onClick={() => {
              setShowFilters(true);
              if (activeTab === 'sales') {
                handleGenerateSalesReport();
              } else if (activeTab === 'inventory') {
                handleGenerateInventoryReport();
              } else if (activeTab === 'customers') {
                handleGenerateCustomerReport();
              } else if (activeTab === 'financial') {
                handleGenerateFinancialReport();
              }
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      )}
    </div>
  );
}
