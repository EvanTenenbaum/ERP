/**
 * React hook for customer management
 * 
 * This hook provides a convenient interface for components
 * to interact with the customer API.
 */

import { useState, useEffect, useCallback } from 'react';
import customerApi from '../api/customers';

/**
 * Hook for customer management
 * @param {Object} initialFilters - Initial filter criteria
 * @returns {Object} Customer management functions and state
 */
export function useCustomers(initialFilters = {}) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [creditRecommendation, setCreditRecommendation] = useState(null);
  const [segments, setSegments] = useState(null);

  // Fetch customers based on filters
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.getCustomers(filters);
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch a single customer by ID
  const fetchCustomer = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.getCustomerById(id);
      setSelectedCustomer(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new customer
  const createCustomer = useCallback(async (customerData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.createCustomer(customerData);
      setCustomers(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing customer
  const updateCustomer = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.updateCustomer(id, updates);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? data : customer
      ));
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);

  // Delete a customer
  const deleteCustomer = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await customerApi.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);

  // Fetch customer metrics
  const fetchCustomerMetrics = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.calculateCustomerMetrics(id);
      setMetrics(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch credit recommendation
  const fetchCreditRecommendation = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.calculateCreditRecommendation(id);
      setCreditRecommendation(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customer segments
  const fetchCustomerSegments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.segmentCustomers();
      setSegments(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Load customers on mount and when filters change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    // State
    customers,
    loading,
    error,
    filters,
    selectedCustomer,
    metrics,
    creditRecommendation,
    segments,
    
    // Actions
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomerMetrics,
    fetchCreditRecommendation,
    fetchCustomerSegments,
    updateFilters,
    clearFilters,
    setSelectedCustomer,
  };
}
