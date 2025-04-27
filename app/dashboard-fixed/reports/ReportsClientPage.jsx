'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '../../../../components/ui/Button';

export default function ReportsClientPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sales');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleViewReport = (reportType) => {
    setSelectedReport(reportType);
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleCloseExport = () => {
    setShowExportDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'sales' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales Reports
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Reports
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'customers' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customer Reports
          </button>
        </div>
      </div>

      {activeTab === 'sales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Sales Summary</h3>
            <p className="text-gray-600 mb-4">Overview of sales performance across all channels.</p>
            <Button onClick={() => handleViewReport('sales-summary')}>View Report</Button>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Sales by Product</h3>
            <p className="text-gray-600 mb-4">Detailed breakdown of sales by individual products.</p>
            <Button onClick={() => handleViewReport('sales-by-product')}>View Report</Button>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Sales Trends</h3>
            <p className="text-gray-600 mb-4">Analysis of sales trends over time periods.</p>
            <Button onClick={() => handleViewReport('sales-trends')}>View Report</Button>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Inventory Status</h3>
            <p className="text-gray-600 mb-4">Current inventory levels across all locations.</p>
            <Button onClick={() => handleViewReport('inventory-status')}>View Report</Button>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Inventory Movement</h3>
            <p className="text-gray-600 mb-4">Analysis of inventory movement and turnover.</p>
            <Button onClick={() => handleViewReport('inventory-movement')}>View Report</Button>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Location Analysis</h3>
            <p className="text-gray-600 mb-4">Inventory analysis by location.</p>
            <Button onClick={() => handleViewReport('location-analysis')}>View Report</Button>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Customer Activity</h3>
            <p className="text-gray-600 mb-4">Overview of customer purchasing activity.</p>
            <Button onClick={() => handleViewReport('customer-activity')}>View Report</Button>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Payment History</h3>
            <p className="text-gray-600 mb-4">Analysis of customer payment patterns.</p>
            <Button onClick={() => handleViewReport('payment-history')}>View Report</Button>
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Credit Recommendations</h3>
            <p className="text-gray-600 mb-4">Smart credit recommendations based on customer history.</p>
            <Button onClick={() => handleViewReport('credit-recommendations')}>View Report</Button>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedReport.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report</h2>
            <Button onClick={handleExport}>Export Report</Button>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Report content would be displayed here</p>
          </div>
        </div>
      )}

      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Export Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Format</label>
                <select className="w-full p-2 border rounded">
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseExport}>Cancel</Button>
                <Button>Export</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
