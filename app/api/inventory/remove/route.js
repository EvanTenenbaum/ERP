import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_INVENTORY);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    const { productId, locationId, quantity, batchNumber } = data;
    
    // Validate required fields
    if (!productId || !locationId || quantity === undefined) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Product ID, location ID, and quantity are required' } },
        { status: 400 }
      );
    }
    
    // Find inventory record
    const inventoryRecord = await (prisma).inventoryRecord.findFirst({
      where: {
        productId,
        locationId,
        batchNumber: batchNumber || null,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!inventoryRecord) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Inventory record not found for the specified product, location, and batch`,
            details: { productId, locationId, batchNumber }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if there's enough inventory
    const removeQuantity = parseFloat(quantity);
    if (inventoryRecord.quantity < removeQuantity) {
      return NextResponse.json(
        { 
          error: { 
            code: 'INSUFFICIENT_INVENTORY', 
            message: `Insufficient inventory. Available: ${inventoryRecord.quantity}, Requested: ${removeQuantity}`,
            details: { 
              available: inventoryRecord.quantity,
              requested: removeQuantity
            }
          } 
        },
        { status: 400 }
      );
    }
    
    // Update inventory record
    const updatedRecord = await (prisma).inventoryRecord.update({
      where: {
        id: inventoryRecord.id,
      },
      data: {
        quantity: {
          decrement: removeQuantity,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            strainType: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
      },
    });
    
    // If quantity is now zero, delete the record
    if (updatedRecord.quantity <= 0) {
      await (prisma).inventoryRecord.delete({
        where: {
          id: inventoryRecord.id,
        },
      });
      
      return NextResponse.json({
        message: 'Inventory record removed completely',
        productId,
        locationId,
        batchNumber,
        removedQuantity: removeQuantity,
      });
    }
    
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error removing inventory:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
