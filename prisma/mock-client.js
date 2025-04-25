// Mock Prisma client for build process
// This file is used during build time to prevent Prisma initialization errors

// Create a mock PrismaClient that doesn't actually connect to the database
// but provides the same interface for type checking
const mockPrismaClient = {
  // Mock basic methods
  $connect: async () => {},
  $disconnect: async () => {},
  $transaction: async (fn) => await fn(mockPrismaClient),
  
  // Mock models with common methods
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
  },
  customer: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
  },
  tenant: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
  },
  sale: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
    aggregate: async () => ({ _sum: { total: 0 } }),
    groupBy: async () => [],
  },
  product: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
  },
  inventory: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
  },
};

// Export the mock client
module.exports = {
  PrismaClient: function() {
    return mockPrismaClient;
  }
};
