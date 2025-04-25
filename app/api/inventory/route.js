import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_INVENTORY);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { searchParams } = new URL(request.url);
  
  try {
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const productId = searchParams.get('productId');
    const locationId = searchParams.get('locationId');
    const lowStock = searchParams.get('lowStock') === 'true';
    const threshold = parseFloat(searchParams.get('threshold') || '10');
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      tenantId: session.user.tenantId,
      ...(productId && { productId }),
      ...(locationId && { locationId }),
      ...(lowStock && { quantity: { lte: threshold } }),
    };
    
    // Get inventory records with pagination
    const [inventoryRecords, total] = await Promise.all([
      (prisma).inventoryRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              strainType: true,
              wholesalePrice: true,
              retailPrice: true,
              inventoryImages: {
                where: {
                  isPrimary: true,
                },
                take: 1,
              },
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
        orderBy: [
          { product: { name: 'asc' } },
          { location: { name: 'asc' } },
        ],
      }),
      (prisma).inventoryRecord.count({ where }),
    ]);
    
    return NextResponse.json({
      data: inventoryRecords,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
