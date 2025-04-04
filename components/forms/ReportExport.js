"use client";

import React, { useState } from 'react';
import Button from '../ui/Button'; // Updated import path

export default function ReportExport({ reportType, onClose }) {
  const [format, setFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  const handleExport = () => {
    // Handle export logic
    console.log('Exporting report:', {
      reportType,
      format,
      includeCharts,
      dateFormat
    });
    
    // Close the export dialog
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Export Report</h2>
        
        <div className="mb-4">
          <label className="form-label">Export Format</label>
          <select 
            className="form-input mt-1"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
            />
            <span>Include Charts and Visualizations</span>
          </label>
        </div>
        
        <div className="mb-6">
          <label className="form-label">Date Format</label>
          <select 
            className="form-input mt-1"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
    </div>
  );
}
