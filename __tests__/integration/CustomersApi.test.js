import request from 'supertest';
import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { GET, POST } from '@/app/api/customers/route';

// Mock the required modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/api-auth', () => ({
  requirePermission: jest.fn(),
}));

// Create a test server
function createTestServer(handler) {
  return createServer((req, res) => {
    return apiResolver(req, res, undefined, handler, {}, false);
  });
}

describe('Customers API Integration Tests', () => {
  let server;
  
  beforeAll(() => {
    server = createTestServer((req, res) => {
      const method = req.method;
      const nextReq = new NextRequest(new URL(req.url, 'http://localhost'), {
        method,
        headers: req.headers,
        body: req.body,
      });
      
      if (method === 'GET') {
        return GET(nextReq);
      } else if (method === 'POST') {
        return POST(nextReq);
      }
    });
  });
  
  afterAll((done) => {
    server.close(done);
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/customers', () => {
    it('returns customers when authorized', async () => {
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
      
      // Make the request
      const response = await request(server)
        .get('/api/customers')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Check the response
      expect(response.body).toEqual({
        data: mockCustomers,
        pagination: {
          total: 2,
          page: 1,
          pageSize: 10,
          pageCount: 1,
        },
      });
    });
    
    it('returns 403 when unauthorized', async () => {
      // Mock the requirePermission function to return unauthorized
      requirePermission.mockResolvedValueOnce({
        authorized: false,
        response: {
          status: 403,
          json: () => ({ error: { message: 'Unauthorized' } }),
        },
      });
      
      // Make the request
      const response = await request(server)
        .get('/api/customers')
        .expect('Content-Type', /json/)
        .expect(403);
      
      // Check the response
      expect(response.body).toEqual({ error: { message: 'Unauthorized' } });
    });
  });
  
  describe('POST /api/customers', () => {
    it('creates a new customer when authorized', async () => {
      // Mock the requirePermission function to return authorized
      requirePermission.mockResolvedValueOnce({
        authorized: true,
        session: {
          user: { id: 'user-1', tenantId: 'tenant-1' },
        },
      });
      
      // Mock the prisma.customer.create function
      const newCustomer = {
        name: 'New Customer',
        email: 'new@example.com',
        phone: '123-456-7890',
      };
      const createdCustomer = {
        id: '3',
        ...newCustomer,
        tenantId: 'tenant-1',
        createdById: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      prisma.customer.create.mockResolvedValueOnce(createdCustomer);
      
      // Make the request
      const response = await request(server)
        .post('/api/customers')
        .send(newCustomer)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // Check the response
      expect(response.body).toEqual(createdCustomer);
      
      // Check that prisma.customer.create was called with the correct arguments
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          ...newCustomer,
          tenantId: 'tenant-1',
          createdById: 'user-1',
        },
      });
    });
    
    it('returns 403 when unauthorized', async () => {
      // Mock the requirePermission function to return unauthorized
      requirePermission.mockResolvedValueOnce({
        authorized: false,
        response: {
          status: 403,
          json: () => ({ error: { message: 'Unauthorized' } }),
        },
      });
      
      // Make the request
      const response = await request(server)
        .post('/api/customers')
        .send({ name: 'Test' })
        .expect('Content-Type', /json/)
        .expect(403);
      
      // Check the response
      expect(response.body).toEqual({ error: { message: 'Unauthorized' } });
    });
    
    it('returns 400 when validation fails', async () => {
      // Mock the requirePermission function to return authorized
      requirePermission.mockResolvedValueOnce({
        authorized: true,
        session: {
          user: { id: 'user-1', tenantId: 'tenant-1' },
        },
      });
      
      // Make the request with invalid data (missing required fields)
      const response = await request(server)
        .post('/api/customers')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Check the response contains validation error
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
