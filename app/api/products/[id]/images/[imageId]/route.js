import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../../../lib/prisma';
import { requirePermission } from '../../../../../../../../../lib/api-auth';
import { PERMISSIONS } from '../../../../../../../../../lib/rbac';

export async function PUT(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_PRODUCT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id, imageId } = params;
  
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
    
    // Verify image exists and belongs to product
    const image = await prisma.inventoryImage.findUnique({
      where: {
        id: imageId,
        productId: id,
      },
    });
    
    if (!image) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Image with ID ${imageId} not found for product ${id}`,
            details: { resourceType: 'inventoryImage', resourceId: imageId }
          } 
        },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    // If setting as primary, unset any existing primary images
    if (data.isPrimary) {
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
    
    // Update image
    const updatedImage = await prisma.inventoryImage.update({
      where: {
        id: imageId,
      },
      data: {
        imageUrl: data.imageUrl || image.imageUrl,
        isPrimary: data.isPrimary !== undefined ? data.isPrimary : image.isPrimary,
      },
    });
    
    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating product image:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.EDIT_PRODUCT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id, imageId } = params;
  
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
    
    // Verify image exists and belongs to product
    const image = await prisma.inventoryImage.findUnique({
      where: {
        id: imageId,
        productId: id,
      },
    });
    
    if (!image) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Image with ID ${imageId} not found for product ${id}`,
            details: { resourceType: 'inventoryImage', resourceId: imageId }
          } 
        },
        { status: 404 }
      );
    }
    
    // If deleting primary image, set another image as primary if available
    if (image.isPrimary) {
      const anotherImage = await prisma.inventoryImage.findFirst({
        where: {
          productId: id,
          id: { not: imageId },
        },
      });
      
      if (anotherImage) {
        await prisma.inventoryImage.update({
          where: {
            id: anotherImage.id,
          },
          data: {
            isPrimary: true,
          },
        });
      }
    }
    
    // Delete image
    await prisma.inventoryImage.delete({
      where: {
        id: imageId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
