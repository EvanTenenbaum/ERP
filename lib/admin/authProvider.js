'use client';

import { getSession } from 'next-auth/react';

/**
 * Auth provider for React-admin
 * 
 * This provider connects React-admin's authentication system with Next-Auth
 * for the Hemp Flower Wholesale ERP system.
 */
const authProvider = {
  // Called when the user attempts to log in
  login: async ({ username, password }) => {
    // In a real implementation, this would validate against your auth system
    // For now, we'll accept any login for testing purposes
    localStorage.setItem('auth', JSON.stringify({ username }));
    return Promise.resolve();
  },
  
  // Called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem('auth');
    return Promise.resolve();
  },
  
  // Called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  // Called when the user navigates to a new location, to check for authentication
  checkAuth: async () => {
    try {
      const session = await getSession();
      if (session) {
        return Promise.resolve();
      }
      
      // For development testing, also allow local storage auth
      const auth = localStorage.getItem('auth');
      if (auth) {
        return Promise.resolve();
      }
      
      return Promise.reject();
    } catch (error) {
      return Promise.reject();
    }
  },
  
  // Called when the user navigates to a new location, to check for permissions / roles
  getPermissions: async () => {
    try {
      const session = await getSession();
      if (session && session.user && session.user.role) {
        return Promise.resolve(session.user.role);
      }
      
      // For development testing
      return Promise.resolve('admin');
    } catch (error) {
      return Promise.reject();
    }
  },
};

export { authProvider };
