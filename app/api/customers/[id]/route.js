// Update to customers/[id]/route.js
// Using dynamic import approach for Prisma client

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
    // Get Prisma client dynamically
    // Using simplified Prisma client singleton
    
    // Fetch customer data
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        contacts: true,
        addresses: true,
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
  const auth = await requirePermission(request, PERMISSIONS.EDIT_CUSTOMERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const data = await request.json();
    
    // Get Prisma client dynamically
    // Using simplified Prisma client singleton
    
    // Verify customer exists and belongs to tenant
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!existingCustomer) {
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
    
    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        ...data,
        // Ensure tenant ID cannot be changed
        tenantId: session.user.tenantId,
      },
      include: {
        contacts: true,
        addresses: true,
      },
    });
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.DELETE_CUSTOMERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Get Prisma client dynamically
    // Using simplified Prisma client singleton
    
    // Verify customer exists and belongs to tenant
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!existingCustomer) {
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
    
    // Delete customer
    await prisma.customer.delete({
      where: {
        id,
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
