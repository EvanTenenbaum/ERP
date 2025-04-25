// Update to customers/[id]/metrics/route.js
// Using dynamic import approach for Prisma client

import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/dynamic-prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_CUSTOMERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Get Prisma client dynamically
    const prisma = await getPrismaClient();
    
    // Verify customer exists and belongs to tenant
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!customer) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Customer with ID ${id} not found`,
            details: { resourceType: 'customer', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Get sales metrics
    const salesMetrics = await prisma.$transaction(async (tx) => {
      // Total sales
      const totalSales = await tx.sale.count({
        where: {
          customerId: id,
          tenantId: session.user.tenantId,
        },
      });
      
      // Total sales amount
      const salesAmount = await tx.sale.aggregate({
        where: {
          customerId: id,
          tenantId: session.user.tenantId,
        },
        _sum: {
          total: true,
        },
      });
      
      // Sales by status
      const salesByStatus = await tx.sale.groupBy({
        by: ['status'],
        where: {
          customerId: id,
          tenantId: session.user.tenantId,
        },
        _count: {
          id: true,
        },
      });
      
      // Payment status
      const paymentStatus = await tx.sale.groupBy({
        by: ['paymentStatus'],
        where: {
          customerId: id,
          tenantId: session.user.tenantId,
        },
        _count: {
          id: true,
        },
        _sum: {
          total: true,
        },
      });
      
      // Recent sales
      const recentSales = await tx.sale.findMany({
        where: {
          customerId: id,
          tenantId: session.user.tenantId,
        },
        orderBy: {
          saleDate: 'desc',
        },
        take: 5,
      });
      
      return {
        totalSales,
        totalAmount: salesAmount._sum.total || 0,
        salesByStatus: salesByStatus.reduce((acc, curr) => {
          acc[curr.status] = curr._count.id;
          return acc;
        }, {}),
        paymentStatus: paymentStatus.reduce((acc, curr) => {
          acc[curr.paymentStatus] = {
            count: curr._count.id,
            amount: curr._sum.total || 0,
          };
          return acc;
        }, {}),
        recentSales,
      };
    });
    
    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        code: customer.code,
      },
      metrics: salesMetrics,
    });
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
