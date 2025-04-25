import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { requirePermission } from '../../../../../lib/api-auth';
import { PERMISSIONS } from '../../../../../lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_INVENTORY);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify product exists and belongs to tenant
    const product = await prisma.product.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      select: {
        id: true,
        name: true,
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
    
    // Get product images
    const images = await prisma.inventoryImage.findMany({
      where: {
        productId: id,
      },
      orderBy: {
        isPrimary: 'desc',
      },
    });
    
    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
      },
      images,
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_PRODUCT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify product exists and belongs to tenant
    const product = await prisma.product.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
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
    
    const data = await request.json();
    
    // Check if this is the first image and set as primary if so
    const existingImagesCount = await prisma.inventoryImage.count({
      where: {
        productId: id,
      },
    });
    
    const isPrimary = data.isPrimary || existingImagesCount === 0;
    
    // If setting as primary, unset any existing primary images
    if (isPrimary) {
      await prisma.inventoryImage.updateMany({
        where: {
          productId: id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }
    
    // Create image
    const image = await prisma.inventoryImage.create({
      data: {
        productId: id,
        imageUrl: data.imageUrl,
        isPrimary,
      },
    });
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error adding product image:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
