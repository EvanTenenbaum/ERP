// Update to customers/[id]/credit-recommendation/route.js
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
    
    // Calculate credit recommendation based on customer data
    // This is a simplified example
    const creditRecommendation = {
      customerId: customer.id,
      recommendedCreditLimit: 5000, // Example value
      riskScore: 75, // Example value
      paymentHistory: {
        onTimePayments: 95, // Example percentage
        latePayments: 5, // Example percentage
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        code: customer.code,
      },
      creditRecommendation,
    });
  } catch (error) {
    console.error('Error generating credit recommendation:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
