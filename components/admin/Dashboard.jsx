'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Title } from 'react-admin';
import { 
  SalesTrendChart, 
  RevenueComparisonChart, 
  DistributionPieChart, 
  InventoryLevelChart 
} from '@/components/charts';

/**
 * Dashboard - Main dashboard component for the reporting section
 * 
 * This component displays key metrics and charts for the Hemp Flower Wholesale ERP system.
 */
const Dashboard = () => {
  // Sample data for demonstration purposes
  const salesData = [
    { period: 'Jan', total: 45000 },
    { period: 'Feb', total: 52000 },
    { period: 'Mar', total: 48000 },
    { period: 'Apr', total: 61000 },
    { period: 'May', total: 55000 },
    { period: 'Jun', total: 67000 },
    { period: 'Jul', total: 72000 },
  ];

  const revenueData = [
    { period: 'Jan', revenue: 45000, cost: 32000 },
    { period: 'Feb', revenue: 52000, cost: 36000 },
    { period: 'Mar', revenue: 48000, cost: 33000 },
    { period: 'Apr', revenue: 61000, cost: 42000 },
    { period: 'May', revenue: 55000, cost: 38000 },
    { period: 'Jun', revenue: 67000, cost: 45000 },
    { period: 'Jul', revenue: 72000, cost: 48000 },
  ];

  const productDistribution = [
    { name: 'Premium Flower', value: 45 },
    { name: 'Mid-tier Flower', value: 30 },
    { name: 'Value Flower', value: 15 },
    { name: 'Pre-rolls', value: 10 },
  ];

  const inventoryData = [
    { date: '2025-01-01', quantity: 1200 },
    { date: '2025-02-01', quantity: 1350 },
    { date: '2025-03-01', quantity: 1100 },
    { date: '2025-04-01', quantity: 950 },
    { date: '2025-05-01', quantity: 1400 },
    { date: '2025-06-01', quantity: 1600 },
    { date: '2025-07-01', quantity: 1450 },
  ];

  // Format currency for tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div>
      <Title title="Hemp Flower Wholesale ERP Dashboard" />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
        <Card sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <CardHeader title="Sales Trend" />
          <CardContent>
            <SalesTrendChart 
              data={salesData} 
              tooltipFormatter={formatCurrency}
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <CardHeader title="Revenue vs. Cost" />
          <CardContent>
            <RevenueComparisonChart 
              data={revenueData} 
              tooltipFormatter={formatCurrency}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <Card sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <CardHeader title="Product Distribution" />
          <CardContent>
            <DistributionPieChart 
              data={productDistribution}
              dataKey="value"
              nameKey="name"
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <CardHeader title="Inventory Levels" />
          <CardContent>
            <InventoryLevelChart 
              data={inventoryData}
              reorderPoint={1000}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Dashboard };
