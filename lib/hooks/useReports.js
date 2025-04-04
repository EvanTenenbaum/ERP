/**
 * React hook for reporting and analytics
 * 
 * This hook provides a convenient interface for components
 * to interact with the reporting API.
 */

import { useState, useCallback } from 'react';
import reportApi from '../api/reports';

/**
 * Hook for reporting and analytics
 * @returns {Object} Reporting functions and state
 */
export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [customerReport, setCustomerReport] = useState(null);
  const [financialReport, setFinancialReport] = useState(null);
  const [customReport, setCustomReport] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportData, setExportData] = useState(null);

  /**
   * Generate sales performance report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Sales performance report
   */
  const generateSalesReport = useCallback(async (options) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportApi.generateSalesPerformanceReport(options);
      setSalesReport(report);
      return report;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate inventory turnover report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Inventory turnover report
   */
  const generateInventoryReport = useCallback(async (options) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportApi.generateInventoryTurnoverReport(options);
      setInventoryReport(report);
      return report;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate customer behavior analysis report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Customer behavior report
   */
  const generateCustomerReport = useCallback(async (options) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportApi.generateCustomerBehaviorReport(options);
      setCustomerReport(report);
      return report;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate financial report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Financial report
   */
  const generateFinancialReport = useCallback(async (options) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportApi.generateFinancialReport(options);
      setFinancialReport(report);
      return report;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate custom report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Custom report
   */
  const generateCustomReport = useCallback(async (options) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportApi.generateCustomReport(options);
      setCustomReport(report);
      return report;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Export report to selected format
   * @param {Object} report - Report data
   * @param {string} format - Export format (csv, excel)
   * @returns {Promise<string|Buffer>} Exported report data
   */
  const exportReport = useCallback(async (report, format = 'csv') => {
    try {
      setLoading(true);
      setError(null);
      let data;
      
      if (format === 'csv') {
        data = await reportApi.exportReportToCsv(report);
      } else if (format === 'excel') {
        data = await reportApi.exportReportToExcel(report);
      } else {
        throw new Error(`Unsupported export format: ${format}`);
      }
      
      setExportFormat(format);
      setExportData(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Download exported report
   * @param {string} filename - Filename without extension
   */
  const downloadExport = useCallback((filename) => {
    if (!exportData) {
      setError('No export data available');
      return;
    }
    
    const extension = exportFormat === 'excel' ? 'xlsx' : 'csv';
    const fullFilename = `${filename}.${extension}`;
    const mimeType = exportFormat === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      : 'text/csv';
    
    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportData, exportFormat]);

  /**
   * Clear all report data
   */
  const clearReports = useCallback(() => {
    setSalesReport(null);
    setInventoryReport(null);
    setCustomerReport(null);
    setFinancialReport(null);
    setCustomReport(null);
    setExportData(null);
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    salesReport,
    inventoryReport,
    customerReport,
    financialReport,
    customReport,
    exportFormat,
    exportData,
    
    // Actions
    generateSalesReport,
    generateInventoryReport,
    generateCustomerReport,
    generateFinancialReport,
    generateCustomReport,
    exportReport,
    downloadExport,
    clearReports,
    
    // Setters
    setExportFormat
  };
}
