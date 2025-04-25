import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/dynamic-prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_INVENTORY);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const product = await (await getPrismaClient()).product.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        inventoryImages: true,
        inventoryRecords: {
          include: {
            location: true,
          },
        },
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Product with ID ${id} not found`,
            details: { resourceType: 'product', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_PRODUCT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const data = await request.json();
    
    // Update product
    const product = await (await getPrismaClient()).product.update({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      data: {
        ...data,
        wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice) : null,
        retailPrice: data.retailPrice ? parseFloat(data.retailPrice) : null,
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.DELETE_PRODUCT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Check if product has inventory records
    const inventoryCount = await (await getPrismaClient()).inventoryRecord.count({
      where: {
        productId: id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (inventoryCount > 0) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_IN_USE', 
            message: 'Cannot delete product with existing inventory',
            details: { inventoryCount }
          } 
        },
        { status: 400 }
      );
    }
    
    // Check if product has been used in sales
    const salesItemCount = await (await getPrismaClient()).saleItem.count({
      where: {
        productId: id,
      },
    });
    
    if (salesItemCount > 0) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_IN_USE', 
            message: 'Cannot delete product that has been sold',
            details: { salesItemCount }
          } 
        },
        { status: 400 }
      );
    }
    
    // Delete product images first
    await (await getPrismaClient()).inventoryImage.deleteMany({
      where: {
        productId: id,
      },
    });
    
    // Delete product
    await (await getPrismaClient()).product.delete({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
