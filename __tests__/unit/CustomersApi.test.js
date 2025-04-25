import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

// Mock the required modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('@/lib/api-auth', () => ({
  requirePermission: jest.fn(),
}));

// Import the route handler
import { GET } from '@/app/api/customers/route';

describe('Customers API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns unauthorized when user does not have permission', async () => {
    // Mock the requirePermission function to return unauthorized
    requirePermission.mockResolvedValueOnce({
      authorized: false,
      response: NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 403 }),
    });

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/customers');

    // Call the route handler
    const response = await GET(request);

    // Check that requirePermission was called with the correct arguments
    expect(requirePermission).toHaveBeenCalledWith(request, PERMISSIONS.VIEW_CUSTOMERS);

    // Check that the response is correct
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data).toEqual({ error: { message: 'Unauthorized' } });
  });

  it('returns customers when user has permission', async () => {
    // Mock the requirePermission function to return authorized
    requirePermission.mockResolvedValueOnce({
      authorized: true,
      session: {
        user: { id: 'user-1', tenantId: 'tenant-1' },
      },
    });

    // Mock the prisma.customer.findMany function
    const mockCustomers = [
      { id: '1', name: 'Customer 1' },
      { id: '2', name: 'Customer 2' },
    ];
    prisma.customer.findMany.mockResolvedValueOnce(mockCustomers);
    prisma.customer.count.mockResolvedValueOnce(2);

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/customers');

    // Call the route handler
    const response = await GET(request);

    // Check that requirePermission was called with the correct arguments
    expect(requirePermission).toHaveBeenCalledWith(request, PERMISSIONS.VIEW_CUSTOMERS);

    // Check that prisma.customer.findMany was called with the correct arguments
    expect(prisma.customer.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { tenantId: 'tenant-1' },
    }));

    // Check that the response is correct
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      data: mockCustomers,
      pagination: {
        total: 2,
        page: 1,
        pageSize: 10,
        pageCount: 1,
      },
    });
  });

  it('applies pagination parameters correctly', async () => {
    // Mock the requirePermission function to return authorized
    requirePermission.mockResolvedValueOnce({
      authorized: true,
      session: {
        user: { id: 'user-1', tenantId: 'tenant-1' },
      },
    });

    // Mock the prisma.customer.findMany function
    const mockCustomers = [
      { id: '3', name: 'Customer 3' },
      { id: '4', name: 'Customer 4' },
    ];
    prisma.customer.findMany.mockResolvedValueOnce(mockCustomers);
    prisma.customer.count.mockResolvedValueOnce(10);

    // Create a mock request with pagination parameters
    const request = new NextRequest('http://localhost:3000/api/customers?page=2&pageSize=2');

    // Call the route handler
    const response = await GET(request);

    // Check that prisma.customer.findMany was called with the correct pagination arguments
    expect(prisma.customer.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 2,
      take: 2,
    }));

    // Check that the response is correct
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      data: mockCustomers,
      pagination: {
        total: 10,
        page: 2,
        pageSize: 2,
        pageCount: 5,
      },
    });
  });

  it('applies search filter correctly', async () => {
    // Mock the requirePermission function to return authorized
    requirePermission.mockResolvedValueOnce({
      authorized: true,
      session: {
        user: { id: 'user-1', tenantId: 'tenant-1' },
      },
    });

    // Mock the prisma.customer.findMany function
    const mockCustomers = [
      { id: '1', name: 'Test Customer' },
    ];
    prisma.customer.findMany.mockResolvedValueOnce(mockCustomers);
    prisma.customer.count.mockResolvedValueOnce(1);

    // Create a mock request with search parameter
    const request = new NextRequest('http://localhost:3000/api/customers?search=test');

    // Call the route handler
    const response = await GET(request);

    // Check that prisma.customer.findMany was called with the correct search arguments
    expect(prisma.customer.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        OR: expect.arrayContaining([
          { name: { contains: 'test', mode: 'insensitive' } },
          { email: { contains: 'test', mode: 'insensitive' } },
          { code: { contains: 'test', mode: 'insensitive' } },
        ]),
      }),
    }));

    // Check that the response is correct
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      data: mockCustomers,
      pagination: {
        total: 1,
        page: 1,
        pageSize: 10,
        pageCount: 1,
      },
    });
  });

  it('handles errors correctly', async () => {
    // Mock the requirePermission function to return authorized
    requirePermission.mockResolvedValueOnce({
      authorized: true,
      session: {
        user: { id: 'user-1', tenantId: 'tenant-1' },
      },
    });

    // Mock the prisma.customer.findMany function to throw an error
    prisma.customer.findMany.mockRejectedValueOnce(new Error('Database error'));

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/customers');

    // Call the route handler
    const response = await GET(request);

    // Check that the response is correct
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  });
});
