import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_SALES);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const sale = await prisma.sale.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            code: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        saleItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
                strainType: true,
                vendorCode: true,
                inventoryImages: {
                  where: {
                    isPrimary: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
        payments: true,
      },
    });
    
    if (!sale) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Sale with ID ${id} not found`,
            details: { resourceType: 'sale', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_SALE);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify sale exists and belongs to tenant
    const existingSale = await prisma.sale.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        saleItems: true,
      },
    });
    
    if (!existingSale) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Sale with ID ${id} not found`,
            details: { resourceType: 'sale', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    const { status, paymentStatus, paymentDate, notes } = data;
    
    // Update sale
    const updatedSale = await prisma.sale.update({
      where: {
        id,
      },
      data: {
        status: status || existingSale.status,
        paymentStatus: paymentStatus || existingSale.paymentStatus,
        paymentDate: paymentDate ? new Date(paymentDate) : existingSale.paymentDate,
        notes: notes !== undefined ? notes : existingSale.notes,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        saleItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
                strainType: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.DELETE_SALE);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify sale exists and belongs to tenant
    const existingSale = await prisma.sale.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        saleItems: true,
        payments: true,
      },
    });
    
    if (!existingSale) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Sale with ID ${id} not found`,
            details: { resourceType: 'sale', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if sale has payments
    if (existingSale.payments.length > 0) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_IN_USE', 
            message: 'Cannot delete sale with associated payments',
            details: { paymentsCount: existingSale.payments.length }
          } 
        },
        { status: 400 }
      );
    }
    
    // Delete sale and items in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete sale items
      await tx.saleItem.deleteMany({
        where: {
          saleId: id,
        },
      });
      
      // Delete sale
      await tx.sale.delete({
        where: {
          id,
        },
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
