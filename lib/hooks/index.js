import { useState, useEffect } from 'react';
import db from '../database';

/**
 * Custom hook for fetching data from the API
 * 
 * @param {string} resource - The API resource to fetch (e.g., 'customers', 'products')
 * @param {Object} query - Query parameters for filtering
 * @param {boolean} initialFetch - Whether to fetch data on initial render
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useData(resource, query = {}, initialFetch = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!resource || !db[resource]) {
      setError(new Error(`Invalid resource: ${resource}`));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await db[resource].findAll(query);
      
      // Check if the result has a data property (paginated response)
      const items = result.data || result;
      
      setData(items);
    } catch (err) {
      console.error(`Error fetching ${resource}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [resource, JSON.stringify(query)]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching a single item by ID
 * 
 * @param {string} resource - The API resource to fetch (e.g., 'customers', 'products')
 * @param {string} id - The ID of the item to fetch
 * @param {boolean} initialFetch - Whether to fetch data on initial render
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useItem(resource, id, initialFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState(null);

  const fetchItem = async () => {
    if (!resource || !db[resource]) {
      setError(new Error(`Invalid resource: ${resource}`));
      setLoading(false);
      return;
    }

    if (!id) {
      setError(new Error('ID is required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await db[resource].findById(id);
      setData(result);
    } catch (err) {
      console.error(`Error fetching ${resource} with ID ${id}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialFetch && id) {
      fetchItem();
    }
  }, [resource, id]);

  return { data, loading, error, refetch: fetchItem };
}

/**
 * Custom hook for creating a new item
 * 
 * @param {string} resource - The API resource (e.g., 'customers', 'products')
 * @returns {Object} - { create, loading, error }
 */
export function useCreate(resource) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    if (!resource || !db[resource]) {
      throw new Error(`Invalid resource: ${resource}`);
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await db[resource].create(data);
      return result;
    } catch (err) {
      console.error(`Error creating ${resource}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

/**
 * Custom hook for updating an item
 * 
 * @param {string} resource - The API resource (e.g., 'customers', 'products')
 * @returns {Object} - { update, loading, error }
 */
export function useUpdate(resource) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = async (id, data) => {
    if (!resource || !db[resource]) {
      throw new Error(`Invalid resource: ${resource}`);
    }

    if (!id) {
      throw new Error('ID is required');
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await db[resource].update(id, data);
      return result;
    } catch (err) {
      console.error(`Error updating ${resource} with ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

/**
 * Custom hook for deleting an item
 * 
 * @param {string} resource - The API resource (e.g., 'customers', 'products')
 * @returns {Object} - { remove, loading, error }
 */
export function useDelete(resource) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    if (!resource || !db[resource]) {
      throw new Error(`Invalid resource: ${resource}`);
    }

    if (!id) {
      throw new Error('ID is required');
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await db[resource].delete(id);
      return result;
    } catch (err) {
      console.error(`Error deleting ${resource} with ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

/**
 * Custom hook for authentication
 * 
 * @returns {Object} - { login, logout, register, user, loading, error }
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial render
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get current user
        if (db.users && db.users.getCurrentUser) {
          const currentUser = await db.users.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        // Not logged in or error
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.auth.login(credentials);
      setUser(result.user);
      return result;
    } catch (err) {
      console.error('Login error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await db.auth.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.auth.register(userData);
      setUser(result.user);
      return result;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, logout, register, user, loading, error };
}

/**
 * Custom hook for inventory operations
 * 
 * @returns {Object} - { addInventory, removeInventory, transferInventory, loading, error }
 */
export function useInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addInventory = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.inventoryRecords.addInventory(data);
      return result;
    } catch (err) {
      console.error('Error adding inventory:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeInventory = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.inventoryRecords.removeInventory(data);
      return result;
    } catch (err) {
      console.error('Error removing inventory:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferInventory = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.inventoryRecords.transferInventory(data);
      return result;
    } catch (err) {
      console.error('Error transferring inventory:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addInventory, removeInventory, transferInventory, loading, error };
}

/**
 * Custom hook for reports
 * 
 * @returns {Object} - { executeReport, loading, error }
 */
export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeReport = async (reportId, parameters) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.reports.execute(reportId, parameters);
      return result;
    } catch (err) {
      console.error(`Error executing report ${reportId}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeReport, loading, error };
}

/**
 * Custom hook for dashboards
 * 
 * @returns {Object} - { getWidgets, addWidget, updateWidget, deleteWidget, loading, error }
 */
export function useDashboards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWidgets = async (dashboardId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.dashboards.getWidgets(dashboardId);
      return result;
    } catch (err) {
      console.error(`Error getting widgets for dashboard ${dashboardId}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addWidget = async (dashboardId, widget) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.dashboards.addWidget(dashboardId, widget);
      return result;
    } catch (err) {
      console.error(`Error adding widget to dashboard ${dashboardId}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWidget = async (dashboardId, widgetId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.dashboards.updateWidget(dashboardId, widgetId, updates);
      return result;
    } catch (err) {
      console.error(`Error updating widget ${widgetId} in dashboard ${dashboardId}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWidget = async (dashboardId, widgetId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db.dashboards.deleteWidget(dashboardId, widgetId);
      return result;
    } catch (err) {
      console.error(`Error deleting widget ${widgetId} from dashboard ${dashboardId}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getWidgets, addWidget, updateWidget, deleteWidget, loading, error };
}
