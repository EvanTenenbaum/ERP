'use client';

import React from 'react';
import { dataProvider as defaultDataProvider } from 'ra-data-fakerest';

/**
 * Data provider for React-admin
 * 
 * This provider connects the React-admin framework to the Hemp Flower Wholesale ERP API.
 * For development purposes, it uses a fake REST provider with sample data.
 * In production, this would be replaced with a real API connection.
 */

// Sample data for development
const sampleData = {
  sales: [
    { id: 1, date: '2025-04-01', customer: 'Green Leaf Dispensary', total: 12500, status: 'completed', paymentStatus: 'paid' },
    { id: 2, date: '2025-04-05', customer: 'Herbal Wellness Co', total: 8750, status: 'completed', paymentStatus: 'paid' },
    { id: 3, date: '2025-04-10', customer: 'Natural Remedies', total: 15000, status: 'processing', paymentStatus: 'pending' },
    { id: 4, date: '2025-04-15', customer: 'Healing Hemp', total: 6200, status: 'completed', paymentStatus: 'partial' },
    { id: 5, date: '2025-04-20', customer: 'CBD Solutions', total: 9800, status: 'completed', paymentStatus: 'paid' },
  ],
  customers: [
    { id: 1, name: 'Green Leaf Dispensary', contact: 'John Smith', email: 'john@greenleaf.com', totalSpend: 45000, orderFrequency: 12, averageOrderValue: 3750 },
    { id: 2, name: 'Herbal Wellness Co', contact: 'Sarah Johnson', email: 'sarah@herbalwellness.com', totalSpend: 32000, orderFrequency: 8, averageOrderValue: 4000 },
    { id: 3, name: 'Natural Remedies', contact: 'Michael Brown', email: 'michael@naturalremedies.com', totalSpend: 58000, orderFrequency: 15, averageOrderValue: 3867 },
    { id: 4, name: 'Healing Hemp', contact: 'Lisa Davis', email: 'lisa@healinghemp.com', totalSpend: 27500, orderFrequency: 7, averageOrderValue: 3929 },
    { id: 5, name: 'CBD Solutions', contact: 'Robert Wilson', email: 'robert@cbdsolutions.com', totalSpend: 41200, orderFrequency: 10, averageOrderValue: 4120 },
  ],
  products: [
    { id: 1, name: 'Premium Indoor Flower', category: 'Premium Flower', thc: 24, cbd: 0.5, price: 1800, stock: 25 },
    { id: 2, name: 'Greenhouse Hybrid', category: 'Mid-tier Flower', thc: 18, cbd: 1, price: 1200, stock: 40 },
    { id: 3, name: 'Outdoor Sativa', category: 'Value Flower', thc: 15, cbd: 0.3, price: 800, stock: 60 },
    { id: 4, name: 'CBD-Rich Strain', category: 'Premium Flower', thc: 8, cbd: 12, price: 1600, stock: 30 },
    { id: 5, name: 'Pre-Roll Pack', category: 'Pre-rolls', thc: 20, cbd: 0.4, price: 400, stock: 100 },
  ],
  inventory: [
    { id: 1, productId: 1, location: 'Warehouse A', quantity: 25, reorderPoint: 15, lastUpdated: '2025-04-01' },
    { id: 2, productId: 2, location: 'Warehouse A', quantity: 40, reorderPoint: 20, lastUpdated: '2025-04-01' },
    { id: 3, productId: 3, location: 'Warehouse B', quantity: 60, reorderPoint: 30, lastUpdated: '2025-04-01' },
    { id: 4, productId: 4, location: 'Warehouse B', quantity: 30, reorderPoint: 15, lastUpdated: '2025-04-01' },
    { id: 5, productId: 5, location: 'Warehouse A', quantity: 100, reorderPoint: 50, lastUpdated: '2025-04-01' },
  ],
  vendors: [
    { id: 1, name: 'Mountain Growers', contact: 'David Miller', email: 'david@mountaingrowers.com', reliability: 4.8, paymentTerms: 'Net 30' },
    { id: 2, name: 'Sunshine Farms', contact: 'Jennifer Lee', email: 'jennifer@sunshinefarms.com', reliability: 4.5, paymentTerms: 'Net 15' },
    { id: 3, name: 'Organic Hemp Co', contact: 'Thomas White', email: 'thomas@organichemp.com', reliability: 4.9, paymentTerms: 'Net 30' },
    { id: 4, name: 'Valley Cultivators', contact: 'Amanda Jones', email: 'amanda@valleycultivators.com', reliability: 4.2, paymentTerms: 'Net 45' },
    { id: 5, name: 'Green Fields', contact: 'Kevin Martin', email: 'kevin@greenfields.com', reliability: 4.7, paymentTerms: 'Net 30' },
  ],
};

// Create the data provider
const dataProvider = defaultDataProvider(sampleData, true);

export { dataProvider };
