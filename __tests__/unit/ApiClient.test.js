import { ApiClient } from '@/lib/api-client';
import { NextResponse } from 'next/server';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    jest.clearAllMocks();
  });

  describe('request method', () => {
    it('makes a GET request with the correct URL and options', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test data' }),
      });

      // Call the request method
      const result = await apiClient.request('customers');

      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      // Check that the result is correct
      expect(result).toEqual({ data: 'test data' });
    });

    it('makes a POST request with the correct URL, options, and body', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'Test Customer' }),
      });

      // Call the request method
      const result = await apiClient.request('customers', 'POST', { name: 'Test Customer' });

      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: 'Test Customer' }),
      });

      // Check that the result is correct
      expect(result).toEqual({ id: '123', name: 'Test Customer' });
    });

    it('handles error responses correctly', async () => {
      // Mock an error response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: { message: 'Not found' } }),
      });

      // Call the request method and expect it to throw
      await expect(apiClient.request('customers/999')).rejects.toThrow('Not found');
    });

    it('handles network errors correctly', async () => {
      // Mock a network error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      // Call the request method and expect it to throw
      await expect(apiClient.request('customers')).rejects.toThrow('Network error');
    });
  });

  describe('CRUD operations', () => {
    it('findAll method makes a GET request with query parameters', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Customer 1' }, { id: '2', name: 'Customer 2' }]),
      });

      // Call the findAll method with query parameters
      const result = await apiClient.findAll('customers', { isActive: true, search: 'test' });

      // Check that fetch was called with the correct URL including query parameters
      expect(global.fetch).toHaveBeenCalledWith('/api/customers?isActive=true&search=test', expect.any(Object));

      // Check that the result is correct
      expect(result).toEqual([{ id: '1', name: 'Customer 1' }, { id: '2', name: 'Customer 2' }]);
    });

    it('findById method makes a GET request with the correct ID', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'Test Customer' }),
      });

      // Call the findById method
      const result = await apiClient.findById('customers', '123');

      // Check that fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith('/api/customers/123', expect.any(Object));

      // Check that the result is correct
      expect(result).toEqual({ id: '123', name: 'Test Customer' });
    });

    it('create method makes a POST request with the correct data', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'New Customer' }),
      });

      // Call the create method
      const result = await apiClient.create('customers', { name: 'New Customer' });

      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: 'New Customer' }),
      });

      // Check that the result is correct
      expect(result).toEqual({ id: '123', name: 'New Customer' });
    });

    it('update method makes a PUT request with the correct ID and data', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'Updated Customer' }),
      });

      // Call the update method
      const result = await apiClient.update('customers', '123', { name: 'Updated Customer' });

      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/customers/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: 'Updated Customer' }),
      });

      // Check that the result is correct
      expect(result).toEqual({ id: '123', name: 'Updated Customer' });
    });

    it('delete method makes a DELETE request with the correct ID', async () => {
      // Mock a successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', deleted: true }),
      });

      // Call the delete method
      const result = await apiClient.delete('customers', '123');

      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/customers/123', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      // Check that the result is correct
      expect(result).toEqual({ id: '123', deleted: true });
    });
  });
});
