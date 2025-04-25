import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
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
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_CUSTOMER);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const data = await request.json();
    
    // Update customer
    const customer = await prisma.customer.update({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      data: {
        ...data,
        creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : null,
      },
    });
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('tenantId_code')) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_CODE', message: 'Customer code already exists' } },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.DELETE_CUSTOMER);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Check if customer has associated sales
    const salesCount = await prisma.sale.count({
      where: {
        customerId: id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (salesCount > 0) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_IN_USE', 
            message: 'Cannot delete customer with associated sales',
            details: { salesCount }
          } 
        },
        { status: 400 }
      );
    }
    
    // Delete customer
    await prisma.customer.delete({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
