import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_VENDORS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const vendor = await (prisma).vendor.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            category: true,
            strainType: true,
            wholesalePrice: true,
            isActive: true,
          },
        },
      },
    });
    
    if (!vendor) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Vendor with ID ${id} not found`,
            details: { resourceType: 'vendor', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_VENDOR);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const data = await request.json();
    
    // Update vendor
    const vendor = await (prisma).vendor.update({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      data,
    });
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('tenantId_code')) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_CODE', message: 'Vendor code already exists' } },
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
  const auth = await requirePermission(request, PERMISSIONS.DELETE_VENDOR);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Check if vendor has associated products
    const productsCount = await (prisma).product.count({
      where: {
        vendorId: id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (productsCount > 0) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_IN_USE', 
            message: 'Cannot delete vendor with associated products',
            details: { productsCount }
          } 
        },
        { status: 400 }
      );
    }
    
    // Delete vendor
    await (prisma).vendor.delete({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
