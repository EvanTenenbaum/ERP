import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/dynamic-prisma';
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
    const { 
      productId, 
      sourceLocationId, 
      destinationLocationId, 
      quantity, 
      sourceBatchNumber,
      destinationBatchNumber 
    } = data;
    
    // Validate required fields
    if (!productId || !sourceLocationId || !destinationLocationId || quantity === undefined) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Product ID, source location, destination location, and quantity are required' } },
        { status: 400 }
      );
    }
    
    // Verify source and destination are different
    if (sourceLocationId === destinationLocationId && sourceBatchNumber === destinationBatchNumber) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Source and destination must be different' } },
        { status: 400 }
      );
    }
    
    // Find source inventory record
    const sourceRecord = await (await getPrismaClient()).inventoryRecord.findFirst({
      where: {
        productId,
        locationId: sourceLocationId,
        batchNumber: sourceBatchNumber || null,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!sourceRecord) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Inventory record not found for the specified product, source location, and batch`,
            details: { productId, sourceLocationId, sourceBatchNumber }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if there's enough inventory
    const transferQuantity = parseFloat(quantity);
    if (sourceRecord.quantity < transferQuantity) {
      return NextResponse.json(
        { 
          error: { 
            code: 'INSUFFICIENT_INVENTORY', 
            message: `Insufficient inventory. Available: ${sourceRecord.quantity}, Requested: ${transferQuantity}`,
            details: { 
              available: sourceRecord.quantity,
              requested: transferQuantity
            }
          } 
        },
        { status: 400 }
      );
    }
    
    // Perform the transfer in a transaction
    const result = await (await getPrismaClient()).$transaction(async (tx) => {
      // Reduce quantity from source
      const updatedSourceRecord = await tx.inventoryRecord.update({
        where: {
          id: sourceRecord.id,
        },
        data: {
          quantity: {
            decrement: transferQuantity,
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      
      // Find or create destination record
      let destinationRecord = await tx.inventoryRecord.findFirst({
        where: {
          productId,
          locationId: destinationLocationId,
          batchNumber: destinationBatchNumber || null,
          tenantId: session.user.tenantId,
        },
      });
      
      if (destinationRecord) {
        // Update existing destination record
        destinationRecord = await tx.inventoryRecord.update({
          where: {
            id: destinationRecord.id,
          },
          data: {
            quantity: {
              increment: transferQuantity,
            },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            location: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      } else {
        // Create new destination record
        destinationRecord = await tx.inventoryRecord.create({
          data: {
            tenantId: session.user.tenantId,
            productId,
            locationId: destinationLocationId,
            quantity: transferQuantity,
            batchNumber: destinationBatchNumber || null,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            location: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      }
      
      // If source quantity is now zero, delete the record
      if (updatedSourceRecord.quantity <= 0) {
        await tx.inventoryRecord.delete({
          where: {
            id: sourceRecord.id,
          },
        });
      }
      
      return {
        source: updatedSourceRecord.quantity > 0 ? updatedSourceRecord : {
          message: 'Source inventory depleted',
          productId,
          locationId: sourceLocationId,
          batchNumber: sourceBatchNumber,
        },
        destination: destinationRecord,
        transferQuantity,
      };
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error transferring inventory:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
