# Authentication Strategy for Hemp Flower Wholesale ERP

## Overview
This document outlines the proposed authentication strategy for the Hemp Flower Wholesale ERP system. The authentication system will provide secure access to the application while supporting multi-tenancy and role-based access control.

## Authentication Requirements

1. **Multi-tenant support**: Each tenant (company) should have isolated data and user accounts
2. **Role-based access control**: Different user roles should have different permissions
3. **Secure authentication**: Industry-standard security practices for authentication
4. **Session management**: Proper handling of user sessions
5. **Password policies**: Enforce strong passwords and secure password recovery
6. **Integration with frontend**: Seamless integration with the existing Next.js frontend

## Recommended Solution: NextAuth.js (Auth.js)

[NextAuth.js](https://next-auth.js.org/) (now known as Auth.js) is the recommended authentication solution for this project because:

1. It's specifically designed for Next.js applications
2. It supports multiple authentication providers
3. It has built-in session management
4. It's actively maintained and has a large community
5. It's flexible and customizable

## Implementation Plan

### 1. Install Required Packages

```bash
npm install next-auth@latest @prisma/client @next-auth/prisma-adapter bcrypt
```

### 2. Database Schema for Authentication

The authentication-related tables are already included in the database schema document. The key tables are:

- `Tenant`: Stores tenant information
- `User`: Stores user accounts with tenant association
- `Session`: Stores user sessions (managed by NextAuth.js)
- `VerificationToken`: Stores tokens for email verification (managed by NextAuth.js)

### 3. NextAuth.js Configuration

Create a configuration file for NextAuth.js:

```javascript
// lib/auth.js
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantId: { label: "Tenant ID", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantId) {
          return null;
        }

        // Find user by email and tenant ID
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            tenantId: credentials.tenantId,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Get tenant information
        const tenant = await prisma.tenant.findUnique({
          where: { id: user.tenantId },
        });

        if (!tenant) {
          return null;
        }

        // Return user with tenant information
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: tenant.id,
          tenantName: tenant.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
        session.user.tenantName = token.tenantName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 4. API Route for NextAuth.js

Create the API route for NextAuth.js:

```javascript
// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 5. Tenant Selection and Login Flow

The authentication flow will include tenant selection:

1. User selects their tenant from a list or enters a tenant identifier
2. User enters their email and password
3. System validates credentials against the selected tenant
4. On successful authentication, user is redirected to the dashboard

Implementation of the login page:

```jsx
// app/auth/login/page.js
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        tenantId,
      });

      if (result.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login to ERP System</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tenantId">Tenant ID</label>
          <input
            id="tenantId"
            type="text"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### 6. Protecting Routes and API Endpoints

#### Client-Side Route Protection

Create a middleware to protect client routes:

```javascript
// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if user is authenticated
  if (!token) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customers/:path*',
    '/inventory/:path*',
    '/sales/:path*',
    '/vendors/:path*',
    '/reports/:path*',
    '/settings/:path*',
  ],
};
```

#### API Route Protection

Create a utility function to protect API routes:

```javascript
// lib/api-auth.js
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

export async function authenticateRequest(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      ),
    };
  }
  
  return {
    authenticated: true,
    session,
  };
}
```

Use this utility in API routes:

```javascript
// Example API route with authentication
import { authenticateRequest } from '@/lib/api-auth';

export async function GET(request) {
  const auth = await authenticateRequest(request);
  
  if (!auth.authenticated) {
    return auth.response;
  }
  
  // Proceed with authenticated request
  const { session } = auth;
  
  // Use session.user.tenantId to scope data access
  // ...
}
```

### 7. Role-Based Access Control (RBAC)

Define user roles and permissions:

```javascript
// lib/rbac.js
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const PERMISSIONS = {
  // Customer permissions
  VIEW_CUSTOMERS: 'view_customers',
  CREATE_CUSTOMER: 'create_customer',
  EDIT_CUSTOMER: 'edit_customer',
  DELETE_CUSTOMER: 'delete_customer',
  
  // Inventory permissions
  VIEW_INVENTORY: 'view_inventory',
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  MANAGE_INVENTORY: 'manage_inventory',
  
  // Sales permissions
  VIEW_SALES: 'view_sales',
  CREATE_SALE: 'create_sale',
  EDIT_SALE: 'edit_sale',
  DELETE_SALE: 'delete_sale',
  
  // Vendor permissions
  VIEW_VENDORS: 'view_vendors',
  CREATE_VENDOR: 'create_vendor',
  EDIT_VENDOR: 'edit_vendor',
  DELETE_VENDOR: 'delete_vendor',
  
  // Report permissions
  VIEW_REPORTS: 'view_reports',
  
  // User management permissions
  MANAGE_USERS: 'manage_users',
  
  // Tenant management permissions
  MANAGE_TENANT: 'manage_tenant',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.EDIT_CUSTOMER,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.EDIT_SALE,
    PERMISSIONS.VIEW_VENDORS,
    PERMISSIONS.CREATE_VENDOR,
    PERMISSIONS.EDIT_VENDOR,
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.VIEW_VENDORS,
    PERMISSIONS.VIEW_REPORTS,
  ],
};

export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}
```

Create a utility function to check permissions in API routes:

```javascript
// lib/api-auth.js (extended)
import { hasPermission } from './rbac';

export async function checkPermission(session, permission) {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  return hasPermission(session.user.role, permission);
}

export async function requirePermission(request, permission) {
  const auth = await authenticateRequest(request);
  
  if (!auth.authenticated) {
    return {
      authorized: false,
      response: auth.response,
    };
  }
  
  const { session } = auth;
  
  if (!await checkPermission(session, permission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' } },
        { status: 403 }
      ),
    };
  }
  
  return {
    authorized: true,
    session,
  };
}
```

Use this utility in API routes:

```javascript
// Example API route with permission check
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.CREATE_CUSTOMER);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  // Proceed with authorized request
  const { session } = auth;
  
  // Use session.user.tenantId to scope data access
  // ...
}
```

### 8. User Management

Create API endpoints for user management:

```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';
import bcrypt from 'bcrypt';

export async function GET(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_USERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const users = await prisma.user.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_USERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash,
        tenantId: session.user.tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
```

### 9. Password Reset Flow

Implement a password reset flow:

```javascript
// app/api/auth/password/reset/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email, tenantId } = await request.json();
    
    // Find user by email and tenant ID
    const user = await prisma.user.findFirst({
      where: {
        email,
        tenantId,
      },
    });
    
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ success: true });
    }
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour
    
    // Save reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });
    
    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
```

### 10. Frontend Integration

Update the AppContext to use NextAuth.js:

```javascript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize hooks
  const customerHook = useCustomers();
  const inventoryHook = useInventory();
  const salesHook = useSales();
  const vendorHook = useVendors();
  const reportsHook = useReports();
  
  // Initialize app on mount and when session changes
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user preferences from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }
        
        // Only initialize data if user is authenticated
        if (status === 'authenticated' && session) {
          // Load initial data
          await Promise.all([
            customerHook.fetchCustomers(),
            inventoryHook.fetchProducts(),
            salesHook.fetchSales(),
            vendorHook.fetchVendors()
          ]);
          
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        addNotification({
          type: 'error',
          message: 'Failed to initialize application. Please refresh the page.',
        });
      }
    };
    
    if (status !== 'loading') {
      initializeApp();
    }
  }, [status, session]);
  
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
  
  // Logout
  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/login' });
  };
  
  // Context value
  const contextValue = {
    // State
    user: session?.user || null,
    tenant: session?.user ? {
      id: session.user.tenantId,
      name: session.user.tenantName,
    } : null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isInitialized,
    notifications,
    theme,
    
    // Actions
    addNotification,
    removeNotification,
    toggleTheme,
    logout,
    
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
```

## Security Considerations

### 1. Password Security

- Passwords will be hashed using bcrypt with a cost factor of 10+
- Password requirements will be enforced:
  - Minimum length of 8 characters
  - Must include uppercase, lowercase, number, and special character
  - Common passwords will be rejected

### 2. Session Security

- JWT tokens will be used for session management
- Sessions will expire after 30 days of inactivity
- Session tokens will be stored in HTTP-only cookies
- CSRF protection will be enabled

### 3. API Security

- All API endpoints will require authentication (except public endpoints)
- Rate limiting will be implemented to prevent brute force attacks
- Input validation will be performed on all API requests
- Tenant isolation will be enforced for all data access

### 4. Environment Variables

The following environment variables will be required:

```
# NextAuth.js
NEXTAUTH_URL=https://your-app-url.com
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/erp

# Email (for password reset)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

## Migration Strategy

The migration from the current localStorage-based authentication to NextAuth.js should be implemented in phases:

1. Set up the database schema for authentication
2. Implement NextAuth.js with credentials provider
3. Create login and user management pages
4. Update the AppContext to use NextAuth.js
5. Implement route protection
6. Migrate existing user data to the new system

This approach allows for a gradual transition with minimal disruption to the existing functionality.

## Conclusion

This authentication strategy provides a secure, scalable solution for the Hemp Flower Wholesale ERP system. By using NextAuth.js with a credentials provider, we can implement a robust authentication system that supports multi-tenancy and role-based access control while integrating seamlessly with the existing Next.js frontend.
