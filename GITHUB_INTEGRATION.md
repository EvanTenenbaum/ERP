# GitHub Integration and CI/CD Pipeline

This document provides information about the GitHub integration and CI/CD pipeline for the Multi-Tenant ERP System.

## GitHub Integration

The ERP system is integrated with GitHub for version control and CI/CD. The repository is located at:

```
https://github.com/EvanTenenbaum/ERP
```

## Vercel Deployment

The application is deployed using Vercel through GitHub integration. This provides:

1. **Automatic Deployments**: Any changes pushed to the main branch are automatically deployed to production
2. **Preview Deployments**: Pull requests generate preview deployments for testing before merging
3. **Environment Variables**: Managed securely through the Vercel dashboard
4. **Analytics**: Performance monitoring and usage statistics
5. **Logs**: Access to deployment and runtime logs

## Deployment Configuration

The deployment configuration is defined in `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "env": {
    "DATABASE_URL": {
      "description": "URL for the database connection"
    },
    "NEXTAUTH_SECRET": {
      "description": "Secret for NextAuth authentication"
    },
    "NEXTAUTH_URL": {
      "description": "URL for NextAuth authentication"
    },
    "NEXT_PUBLIC_APP_URL": {
      "description": "Public URL of the application"
    }
  },
  "github": {
    "silent": true,
    "autoJobCancelation": true
  }
}
```

## Environment Variables

The following environment variables are required for deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | URL for the database connection | `postgresql://user:password@localhost:5432/erp` |
| NEXTAUTH_SECRET | Secret for NextAuth authentication | `your-secret-key` |
| NEXTAUTH_URL | URL for NextAuth authentication | `https://your-app.vercel.app` |
| NEXT_PUBLIC_APP_URL | Public URL of the application | `https://your-app.vercel.app` |

## CI/CD Pipeline

The CI/CD pipeline includes the following steps:

1. **Code Push**: Developer pushes code to GitHub
2. **Automated Tests**: Tests are run automatically
3. **Code Quality Checks**: ESLint checks for code quality
4. **Build**: Application is built
5. **Deployment**: Application is deployed to Vercel
6. **Post-Deployment Tests**: Automated tests verify the deployment

## Deployment Instructions

To deploy the application:

1. Ensure all changes are committed and pushed to the main branch
2. Vercel will automatically detect the changes and start the deployment process
3. Monitor the deployment in the Vercel dashboard
4. Once deployment is complete, verify the application is working correctly

## Manual Deployment

If you need to deploy manually:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the application:
   ```
   vercel --prod
   ```

## Rollback Procedure

If you need to rollback to a previous deployment:

1. Go to the Vercel dashboard
2. Navigate to the Deployments tab
3. Find the deployment you want to rollback to
4. Click the three dots menu and select "Promote to Production"

## Monitoring and Logs

To monitor the application and view logs:

1. Go to the Vercel dashboard
2. Navigate to the project
3. Click on "Analytics" to view performance metrics
4. Click on "Logs" to view application logs

## Conclusion

This document provides information about the GitHub integration and CI/CD pipeline for the Multi-Tenant ERP System. It should be updated as the deployment process evolves.
