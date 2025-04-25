import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requirePermission } from '../../../../lib/api-auth';
import { PERMISSIONS } from '../../../../lib/rbac';

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
    
    // Verify product exists and belongs to tenant
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Product with ID ${productId} not found`,
            details: { resourceType: 'product', resourceId: productId }
          } 
        },
        { status: 404 }
      );
    }
    
    // Verify location exists and belongs to tenant
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!location) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Location with ID ${locationId} not found`,
            details: { resourceType: 'location', resourceId: locationId }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if inventory record already exists
    const existingRecord = await prisma.inventoryRecord.findFirst({
      where: {
        productId,
        locationId,
        batchNumber: batchNumber || null,
        tenantId: session.user.tenantId,
      },
    });
    
    let inventoryRecord;
    
    if (existingRecord) {
      // Update existing record
      inventoryRecord = await prisma.inventoryRecord.update({
        where: {
          id: existingRecord.id,
        },
        data: {
          quantity: {
            increment: parseFloat(quantity),
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
    } else {
      // Create new record
      inventoryRecord = await prisma.inventoryRecord.create({
        data: {
          tenantId: session.user.tenantId,
          productId,
          locationId,
          quantity: parseFloat(quantity),
          batchNumber,
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
    }
    
    return NextResponse.json(inventoryRecord);
  } catch (error) {
    console.error('Error adding inventory:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
