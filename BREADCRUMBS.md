# ERP System Project Breadcrumbs

This document serves as a guide for continuing development on the Multi-Tenant ERP System. It contains key information about the project structure, recent fixes, and known issues to help you pick up where we left off.

## Project Overview

- **Project**: Multi-Tenant ERP System for hemp flower wholesale brokerage businesses
- **Framework**: Next.js 14.2.26
- **Deployment**: Vercel
- **Repository**: https://github.com/EvanTenenbaum/ERP

## Recent Development History

### CI/CD Pipeline Implementation

- Successfully implemented CI/CD pipeline with GitHub Actions and Vercel deployment
- Fixed ESLint dependency conflicts (downgraded from v9 alpha to v8.57.0 for compatibility with eslint-config-next)
- Created missing form components (CustomerForm, InventoryForm, SalesForm, VendorForm)
- Fixed component import issues (Button component and import paths)

### Navigation and Routing Fixes

- Fixed routing issues related to Next.js route groups
- **Important**: The project uses Next.js route groups with folders like `{dashboard}` for organization
- Route groups (folders with curly braces) don't affect the actual URL path
- Navigation links should use paths without the curly braces (e.g., `/inventory` not `/{dashboard}/inventory`)

## Project Structure

- `app/` - Next.js App Router structure
  - `{dashboard}/` - Route group for dashboard features (note: curly braces are for organization only)
    - `customers/` - Customer management module
    - `inventory/` - Inventory management module
    - `reports/` - Reporting module
    - `sales/` - Sales management module
    - `vendors/` - Vendor management module
- `components/` - React components
  - `forms/` - Form components for data entry
  - `ui/` - UI components like Button, etc.

## Known Issues and Solutions

### Next.js Route Groups

**Issue**: Navigation links with curly braces (e.g., `/{dashboard}/inventory`) cause 404 errors because Next.js treats the curly braces as literal characters in the URL.

**Solution**: Use paths without the curly braces in navigation links:
- Correct: `/inventory`, `/customers`, `/reports`
- Incorrect: `/{dashboard}/inventory`, `/{dashboard}/customers`

### Component Imports

**Issue**: Some components had incorrect import paths, causing build failures.

**Solution**: Ensure import paths match the actual directory structure:
- For components in the same directory level, use relative imports (`../ui/Button` not `../../ui/Button`)
- Check for missing components and create them if needed

## Deployment Notes

- The application is deployed on Vercel
- ESLint version must be compatible with eslint-config-next (use v8.x, not v9.x)
- Vercel project must be set to public for non-authenticated access

## Next Steps

1. Test all navigation links to ensure they work correctly
2. Complete any remaining modules or features
3. Add authentication if required
4. Consider implementing tests for critical functionality
5. Enhance documentation for end users

## Troubleshooting

If you encounter build failures:
1. Check Vercel build logs for specific errors
2. Verify component import paths
3. Ensure dependencies are compatible with each other
4. Check for missing components or files
5. Verify routing configuration matches Next.js App Router conventions
