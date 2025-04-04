'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { useInventory } from '../hooks/useInventory';
import { useSales } from '../hooks/useSales';
import { useVendors } from '../hooks/useVendors';
import { useReports } from '../hooks/useReports';

// Create context
const AppContext = createContext();

/**
 * App context provider component
 * 
 * This component provides a global state and shared functionality
 * across the application.
 */
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');
  
  // Initialize hooks
  const customerHook = useCustomers();
  const inventoryHook = useInventory();
  const salesHook = useSales();
  const vendorHook = useVendors();
  const reportsHook = useReports();
  
  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user preferences from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }
        
        // Simulate user authentication (would be replaced with actual auth)
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'admin'
        };
        
        // Simulate tenant selection (would be replaced with actual tenant selection)
        const mockTenant = {
          id: '1',
          name: 'Hemp Flower Wholesale',
          plan: 'enterprise',
          features: ['customers', 'inventory', 'sales', 'vendors', 'reports']
        };
        
        setUser(mockUser);
        setTenant(mockTenant);
        
        // Load initial data
        await Promise.all([
          customerHook.fetchCustomers(),
          inventoryHook.fetchProducts(),
          salesHook.fetchSales(),
          vendorHook.fetchVendors()
        ]);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        addNotification({
          type: 'error',
          message: 'Failed to initialize application. Please refresh the page.',
        });
      }
    };
    
    initializeApp();
  }, []);
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notifications after 5 seconds
    if (notification.type !== 'error') {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  };
  
  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // Create integrated data access methods
  
  // Get customer with sales history
  const getCustomerWithSalesHistory = async (customerId) => {
    const customer = await customerHook.fetchCustomer(customerId);
    if (!customer) return null;
    
    const customerSales = await salesHook.fetchSalesByCustomer(customerId);
    return {
      ...customer,
      salesHistory: customerSales
    };
  };
  
  // Get product with inventory levels
  const getProductWithInventoryLevels = async (productId) => {
    const product = await inventoryHook.fetchProduct(productId);
    if (!product) return null;
    
    const inventoryLevels = await inventoryHook.fetchInventoryLevelsByProduct(productId);
    return {
      ...product,
      inventoryLevels
    };
  };
  
  // Get vendor with purchase orders
  const getVendorWithPurchaseOrders = async (vendorId) => {
    const vendor = await vendorHook.fetchVendor(vendorId);
    if (!vendor) return null;
    
    const purchaseOrders = await vendorHook.fetchVendorPurchaseOrders(vendorId);
    return {
      ...vendor,
      purchaseOrders
    };
  };
  
  // Create sale with inventory update
  const createSaleWithInventoryUpdate = async (saleData) => {
    // Create the sale
    const sale = await salesHook.createSale(saleData);
    if (!sale) return null;
    
    // Update inventory levels for each product
    for (const item of saleData.items) {
      await inventoryHook.updateInventoryLevel(
        item.productId,
        item.locationId,
        -item.quantity // Negative quantity for sales
      );
    }
    
    // Add notification
    addNotification({
      type: 'success',
      message: `Sale #${sale.saleNumber} created successfully.`
    });
    
    return sale;
  };
  
  // Create purchase order with vendor update
  const createPurchaseOrderWithVendorUpdate = async (poData) => {
    // Create the purchase order
    const purchaseOrder = await vendorHook.createPurchaseOrder(poData);
    if (!purchaseOrder) return null;
    
    // Update vendor metrics
    await vendorHook.calculateVendorPerformance(poData.vendorId);
    
    // Add notification
    addNotification({
      type: 'success',
      message: `Purchase Order #${purchaseOrder.poNumber} created successfully.`
    });
    
    return purchaseOrder;
  };
  
  // Generate comprehensive dashboard data
  const generateDashboardData = async () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Generate reports
    const salesReport = await reportsHook.generateSalesReport({
      startDate: startOfMonth,
      endDate: endOfMonth,
      groupBy: 'day'
    });
    
    const financialReport = await reportsHook.generateFinancialReport({
      startDate: startOfMonth,
      endDate: endOfMonth,
      groupBy: 'day'
    });
    
    // Get counts
    const customerCount = customerHook.customers.length;
    const productCount = inventoryHook.products.length;
    const salesCount = salesHook.sales.length;
    const vendorCount = vendorHook.vendors.length;
    
    // Get low stock products
    const lowStockProducts = inventoryHook.products.filter(product => 
      product.quantity < product.reorderPoint
    );
    
    // Get recent sales
    const recentSales = salesHook.sales
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // Get upcoming payments
    const upcomingPayments = await vendorHook.getUpcomingVendorPayments(
      today,
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    );
    
    return {
      counts: {
        customers: customerCount,
        products: productCount,
        sales: salesCount,
        vendors: vendorCount
      },
      salesReport,
      financialReport,
      lowStockProducts,
      recentSales,
      upcomingPayments
    };
  };
  
  // Context value
  const contextValue = {
    // State
    user,
    tenant,
    isInitialized,
    notifications,
    theme,
    
    // Actions
    addNotification,
    removeNotification,
    toggleTheme,
    
    // Integrated methods
    getCustomerWithSalesHistory,
    getProductWithInventoryLevels,
    getVendorWithPurchaseOrders,
    createSaleWithInventoryUpdate,
    createPurchaseOrderWithVendorUpdate,
    generateDashboardData,
    
    // Individual hooks
    customers: customerHook,
    inventory: inventoryHook,
    sales: salesHook,
    vendors: vendorHook,
    reports: reportsHook
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
