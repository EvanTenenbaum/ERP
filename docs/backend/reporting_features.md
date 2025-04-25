# Reporting Features for Hemp Flower Wholesale ERP

## Overview

This document outlines the reporting features to be integrated into the Hemp Flower Wholesale ERP system. These features will provide comprehensive business intelligence capabilities, allowing users to analyze sales, inventory, customer behavior, and financial performance.

## Database Schema Extensions

### Reporting Metadata Tables

#### ReportDefinitions
- Stores metadata about available reports
- Fields:
  - `report_id`: UUID, primary key
  - `report_name`: String, name of the report
  - `report_description`: Text, description of the report
  - `report_category`: String, category of the report (e.g., 'Sales', 'Inventory')
  - `report_type`: String, type of report (e.g., 'Table', 'Chart')
  - `created_by`: UUID, reference to User
  - `created_at`: DateTime
  - `updated_at`: DateTime
  - `is_system_report`: Boolean, whether it's a system-defined report
  - `is_active`: Boolean, whether the report is active

#### ReportParameters
- Stores parameters for customizable reports
- Fields:
  - `parameter_id`: UUID, primary key
  - `report_id`: UUID, reference to ReportDefinitions
  - `parameter_name`: String, name of the parameter
  - `parameter_label`: String, display label for the parameter
  - `parameter_type`: String, type of parameter (e.g., 'Date', 'String', 'Number')
  - `is_required`: Boolean, whether the parameter is required
  - `default_value`: Text, default value for the parameter
  - `parameter_order`: Integer, order of parameter in the UI

#### ReportLayouts
- Stores layout configurations for reports
- Fields:
  - `layout_id`: UUID, primary key
  - `report_id`: UUID, reference to ReportDefinitions
  - `layout_name`: String, name of the layout
  - `layout_config`: JSON, configuration for the layout
  - `is_default`: Boolean, whether it's the default layout
  - `created_by`: UUID, reference to User
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Dashboard Configuration Tables

#### Dashboards
- Stores dashboard definitions
- Fields:
  - `dashboard_id`: UUID, primary key
  - `dashboard_name`: String, name of the dashboard
  - `dashboard_description`: Text, description of the dashboard
  - `is_system_dashboard`: Boolean, whether it's a system-defined dashboard
  - `created_by`: UUID, reference to User
  - `created_at`: DateTime
  - `updated_at`: DateTime
  - `is_active`: Boolean, whether the dashboard is active

#### DashboardWidgets
- Stores widgets for dashboards
- Fields:
  - `widget_id`: UUID, primary key
  - `dashboard_id`: UUID, reference to Dashboards
  - `widget_type`: String, type of widget (e.g., 'Chart', 'KPI')
  - `widget_name`: String, name of the widget
  - `widget_config`: JSON, configuration for the widget
  - `position_x`: Integer, x-position on the dashboard grid
  - `position_y`: Integer, y-position on the dashboard grid
  - `width`: Integer, width of the widget
  - `height`: Integer, height of the widget
  - `created_at`: DateTime
  - `updated_at`: DateTime

#### UserDashboards
- Stores user-specific dashboard configurations
- Fields:
  - `user_dashboard_id`: UUID, primary key
  - `user_id`: UUID, reference to User
  - `dashboard_id`: UUID, reference to Dashboards
  - `is_favorite`: Boolean, whether it's a favorite dashboard
  - `layout_config`: JSON, user-specific layout configuration
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Report Scheduling and Distribution Tables

#### ScheduledReports
- Stores scheduled report configurations
- Fields:
  - `schedule_id`: UUID, primary key
  - `report_id`: UUID, reference to ReportDefinitions
  - `schedule_name`: String, name of the schedule
  - `cron_expression`: String, cron expression for scheduling
  - `parameter_values`: JSON, values for report parameters
  - `output_format`: String, output format (e.g., 'PDF', 'CSV')
  - `created_by`: UUID, reference to User
  - `created_at`: DateTime
  - `updated_at`: DateTime
  - `is_active`: Boolean, whether the schedule is active

#### ReportDistributions
- Stores distribution configurations for scheduled reports
- Fields:
  - `distribution_id`: UUID, primary key
  - `schedule_id`: UUID, reference to ScheduledReports
  - `distribution_type`: String, type of distribution (e.g., 'Email', 'FTP')
  - `distribution_config`: JSON, configuration for the distribution
  - `created_at`: DateTime
  - `updated_at`: DateTime

### Audit and History Tables

#### ReportExecutionHistory
- Stores history of report executions
- Fields:
  - `execution_id`: UUID, primary key
  - `report_id`: UUID, reference to ReportDefinitions
  - `user_id`: UUID, reference to User
  - `execution_start`: DateTime, when execution started
  - `execution_end`: DateTime, when execution completed
  - `status`: String, execution status (e.g., 'Success', 'Failed')
  - `parameter_values`: JSON, parameter values used
  - `error_message`: Text, error message if failed

#### ReportAuditLog
- Stores audit log for reporting-related actions
- Fields:
  - `audit_id`: UUID, primary key
  - `entity_type`: String, type of entity (e.g., 'Report', 'Dashboard')
  - `entity_id`: UUID, ID of the entity
  - `action`: String, action performed (e.g., 'Create', 'Update')
  - `user_id`: UUID, reference to User
  - `timestamp`: DateTime, when the action occurred
  - `old_values`: JSON, previous values
  - `new_values`: JSON, new values

## Database Views for Reporting

### Financial Reporting Views

#### FinancialSummaryView
- Provides a summary of financial transactions
- Includes transaction date, type, amount, currency, account, customer, and vendor information

#### ProfitAndLossView
- Provides monthly profit and loss summary
- Includes revenue, expenses, and profit by month

### Sales Reporting Views

#### SalesSummaryView
- Provides a summary of sales
- Includes sale date, amount, status, customer, and sales rep information

#### ProductSalesView
- Provides product sales analysis
- Includes product information, quantity sold, revenue, number of sales, and average selling price

### Inventory Reporting Views

#### InventorySummaryView
- Provides a summary of inventory
- Includes product information, total quantity, total value, and inventory age

#### InventoryMovementView
- Provides inventory movement history
- Includes movement date, type, quantity, product, location, and user information

### Customer Reporting Views

#### CustomerAnalyticsView
- Provides customer analytics
- Includes customer information, purchase history, spending, and recency metrics

### Vendor Reporting Views

#### VendorPerformanceView
- Provides vendor performance metrics
- Includes vendor information, order history, delivery time, and on-time delivery rate

## Database Indexes for Performance

### Transaction Table Indexes
- Index on transaction date
- Index on transaction type
- Index on account ID
- Index on customer ID
- Index on vendor ID

### Sales Table Indexes
- Index on sale date
- Index on customer ID
- Index on sales rep ID
- Index on status

### Inventory Table Indexes
- Index on product ID
- Index on location ID
- Index on last updated date

### Report Execution Indexes
- Index on report ID
- Index on user ID
- Index on execution start date
- Index on status

## Database Procedures for Reporting

### GeneratePeriodOverPeriodComparison
- Generates period-over-period comparison for specified metrics
- Parameters:
  - Metric to compare
  - Current period start and end dates
  - Previous period start and end dates
  - Grouping dimension

### CalculateKPIs
- Calculates key performance indicators
- Parameters:
  - Start date
  - End date
- KPIs calculated:
  - Total Revenue
  - Average Order Value
  - Total Orders
  - Inventory Value
  - Inventory Turnover
  - New Customers

## Data Warehousing Considerations

### Fact Tables
- SalesFact: Detailed sales transactions
- InventoryFact: Inventory movements and adjustments
- FinancialFact: Financial transactions
- PurchaseFact: Purchase order details

### Dimension Tables
- DateDimension: Calendar date attributes
- ProductDimension: Product attributes
- CustomerDimension: Customer attributes
- VendorDimension: Vendor attributes
- LocationDimension: Location attributes
- UserDimension: User attributes

### ETL Processes
- Daily incremental loads from transactional database
- Weekly full refresh of slowly changing dimensions
- Monthly data quality checks and cleanup
- Real-time streaming for critical metrics

## Real-time Data Requirements

### Change Data Capture (CDC)
- Database triggers for real-time updates
- Binary log monitoring for change tracking
- Message queues for event propagation

### Caching Strategy
- Redis for high-frequency report caching
- Tiered caching with different expiration policies
- Cache invalidation based on data changes

### Partitioning Strategy
- Time-based partitioning for historical data
- Range partitioning for large transaction tables
- Partition rotation policies for optimal performance

## API Endpoints for Reporting

### Report Definition Endpoints
```
GET /api/reports
GET /api/reports/:id
POST /api/reports
PUT /api/reports/:id
DELETE /api/reports/:id
```

### Report Execution Endpoints
```
POST /api/reports/:id/execute
GET /api/reports/executions
GET /api/reports/executions/:id
GET /api/reports/executions/:id/download
```

### Dashboard Endpoints
```
GET /api/dashboards
GET /api/dashboards/:id
POST /api/dashboards
PUT /api/dashboards/:id
DELETE /api/dashboards/:id
GET /api/dashboards/:id/widgets
POST /api/dashboards/:id/widgets
PUT /api/dashboards/:id/widgets/:widgetId
DELETE /api/dashboards/:id/widgets/:widgetId
```

### Report Scheduling Endpoints
```
GET /api/reports/:id/schedules
POST /api/reports/:id/schedules
PUT /api/reports/:id/schedules/:scheduleId
DELETE /api/reports/:id/schedules/:scheduleId
POST /api/reports/:id/schedules/:scheduleId/execute
```

### Analytics Endpoints
```
GET /api/analytics/sales
GET /api/analytics/inventory
GET /api/analytics/customers
GET /api/analytics/vendors
GET /api/analytics/finance
```

## Frontend Integration

### Report Builder Component
- Visual report builder interface
- Drag-and-drop field selection
- Filter configuration
- Chart type selection
- Layout customization

### Dashboard Builder Component
- Visual dashboard builder interface
- Widget placement and sizing
- Widget configuration
- Dashboard sharing options

### Report Viewer Component
- Interactive report viewing
- Filtering and sorting
- Export options (PDF, Excel, CSV)
- Drill-down capabilities

### Dashboard Viewer Component
- Interactive dashboard viewing
- Widget interaction
- Real-time updates
- Filter synchronization across widgets

## Implementation Considerations

### Performance Optimization
- Implement query optimization for complex reports
- Use materialized views for frequently accessed reports
- Implement caching for dashboard widgets
- Use pagination for large result sets

### Security Considerations
- Implement row-level security for multi-tenant reports
- Add permission checks for report access
- Audit logging for report execution
- Secure parameter handling to prevent injection

### Scalability Considerations
- Design for horizontal scaling of report execution
- Implement asynchronous report generation for large reports
- Use background workers for scheduled reports
- Implement rate limiting for report API endpoints

## Integration with Existing System

The reporting features will be integrated with the existing ERP system by:

1. Extending the database schema with the reporting-related tables
2. Adding the reporting API endpoints to the existing API structure
3. Implementing the frontend components for report building and viewing
4. Integrating the dashboard functionality into the main dashboard
5. Adding report scheduling and distribution capabilities

This integration will provide a seamless experience for users while adding powerful business intelligence capabilities to the ERP system.
