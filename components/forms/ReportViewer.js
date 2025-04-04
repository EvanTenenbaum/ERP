"use client";

import React, { useState } from 'react';
import Button from '../ui/Button'; // Updated import path

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
    // Rest of the report data...
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
  
  // Render functions for different report types
  const renderSalesSummary = () => {
    // Implementation details
    return <div>Sales Summary Report</div>;
  };
  
  const renderSalesByProduct = () => {
    // Implementation details
    return <div>Sales By Product Report</div>;
  };
  
  const renderSalesTrends = () => {
    // Implementation details
    return <div>Sales Trends Report</div>;
  };
  
  const renderInventoryStatus = () => {
    // Implementation details
    return <div>Inventory Status Report</div>;
  };
  
  const renderInventoryMovement = () => {
    // Implementation details
    return <div>Inventory Movement Report</div>;
  };
  
  const renderLocationAnalysis = () => {
    // Implementation details
    return <div>Location Analysis Report</div>;
  };
  
  const renderCustomerActivity = () => {
    // Implementation details
    return <div>Customer Activity Report</div>;
  };
  
  const renderPaymentHistory = () => {
    // Implementation details
    return <div>Payment History Report</div>;
  };
  
  const renderCreditRecommendations = () => {
    // Implementation details
    return <div>Credit Recommendations Report</div>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{reportType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Report</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>Export</Button>
          <Button variant="outline" onClick={() => {}}>Print</Button>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label htmlFor="timeRange" className="mr-2">Time Range:</label>
            <select 
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-select"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
        
        {renderReport()}
      </div>
    </div>
  );
}
