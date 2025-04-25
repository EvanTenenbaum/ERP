import { renderHook, act } from '@testing-library/react';
import { useData, useItem, useCreate, useUpdate, useDelete } from '@/lib/hooks';
import db from '@/lib/database';

// Mock the database module
jest.mock('@/lib/database', () => ({
  customers: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Data Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useData hook', () => {
    it('fetches data on initial render', async () => {
      // Mock the findAll function to return test data
      const mockData = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }];
      db.customers.findAll.mockResolvedValueOnce(mockData);

      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useData('customers'));

      // Initially, it should be loading with no data
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(null);

      // Wait for the data to load
      await waitForNextUpdate();

      // After loading, it should have the data
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);

      // Check that the database function was called correctly
      expect(db.customers.findAll).toHaveBeenCalledWith({});
    });

    it('applies query parameters correctly', async () => {
      // Mock the findAll function to return test data
      const mockData = [{ id: '1', name: 'Test 1' }];
      db.customers.findAll.mockResolvedValueOnce(mockData);

      // Render the hook with query parameters
      const query = { search: 'test', isActive: true };
      const { result, waitForNextUpdate } = renderHook(() => useData('customers', query));

      // Wait for the data to load
      await waitForNextUpdate();

      // Check that the database function was called with the query parameters
      expect(db.customers.findAll).toHaveBeenCalledWith(query);
    });

    it('handles errors correctly', async () => {
      // Mock the findAll function to throw an error
      const mockError = new Error('Test error');
      db.customers.findAll.mockRejectedValueOnce(mockError);

      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useData('customers'));

      // Wait for the error to be caught
      await waitForNextUpdate();

      // After loading, it should have the error
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(mockError);
    });

    it('refetches data when refetch is called', async () => {
      // Mock the findAll function to return different data on each call
      const mockData1 = [{ id: '1', name: 'Test 1' }];
      const mockData2 = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }];
      db.customers.findAll.mockResolvedValueOnce(mockData1);
      db.customers.findAll.mockResolvedValueOnce(mockData2);

      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useData('customers'));

      // Wait for the initial data to load
      await waitForNextUpdate();

      // Check that the initial data is correct
      expect(result.current.data).toEqual(mockData1);

      // Call refetch
      act(() => {
        result.current.refetch();
      });

      // Wait for the refetched data to load
      await waitForNextUpdate();

      // Check that the refetched data is correct
      expect(result.current.data).toEqual(mockData2);
      expect(db.customers.findAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('useItem hook', () => {
    it('fetches a single item by ID', async () => {
      // Mock the findById function to return test data
      const mockItem = { id: '1', name: 'Test 1' };
      db.customers.findById.mockResolvedValueOnce(mockItem);

      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useItem('customers', '1'));

      // Initially, it should be loading with no data
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      // Wait for the data to load
      await waitForNextUpdate();

      // After loading, it should have the data
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockItem);
      expect(result.current.error).toBe(null);

      // Check that the database function was called correctly
      expect(db.customers.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('useCreate hook', () => {
    it('creates a new item', async () => {
      // Mock the create function to return the created item
      const newItem = { name: 'New Test' };
      const createdItem = { id: '3', name: 'New Test' };
      db.customers.create.mockResolvedValueOnce(createdItem);

      // Render the hook
      const { result } = renderHook(() => useCreate('customers'));

      // Initially, it should not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      // Call create
      let returnedItem;
      await act(async () => {
        returnedItem = await result.current.create(newItem);
      });

      // Check that the database function was called correctly
      expect(db.customers.create).toHaveBeenCalledWith(newItem);

      // Check that the returned item is correct
      expect(returnedItem).toEqual(createdItem);
    });
  });

  describe('useUpdate hook', () => {
    it('updates an existing item', async () => {
      // Mock the update function to return the updated item
      const updates = { name: 'Updated Test' };
      const updatedItem = { id: '1', name: 'Updated Test' };
      db.customers.update.mockResolvedValueOnce(updatedItem);

      // Render the hook
      const { result } = renderHook(() => useUpdate('customers'));

      // Call update
      let returnedItem;
      await act(async () => {
        returnedItem = await result.current.update('1', updates);
      });

      // Check that the database function was called correctly
      expect(db.customers.update).toHaveBeenCalledWith('1', updates);

      // Check that the returned item is correct
      expect(returnedItem).toEqual(updatedItem);
    });
  });

  describe('useDelete hook', () => {
    it('deletes an item', async () => {
      // Mock the delete function to return the deleted item
      const deletedItem = { id: '1', name: 'Test 1', deleted: true };
      db.customers.delete.mockResolvedValueOnce(deletedItem);

      // Render the hook
      const { result } = renderHook(() => useDelete('customers'));

      // Call delete
      let returnedItem;
      await act(async () => {
        returnedItem = await result.current.remove('1');
      });

      // Check that the database function was called correctly
      expect(db.customers.delete).toHaveBeenCalledWith('1');

      // Check that the returned item is correct
      expect(returnedItem).toEqual(deletedItem);
    });
  });
});
