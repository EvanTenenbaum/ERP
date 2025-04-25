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
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const strainType = searchParams.get('strainType');
    const vendorId = searchParams.get('vendorId');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined;
    const isActive = searchParams.get('isActive') === 'true';
    const sortBy = searchParams.get('sort') || 'name';
    const sortOrder = searchParams.get('order') || 'asc';
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      tenantId: session.user.tenantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { vendorCode: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      ...(strainType && { strainType }),
      ...(vendorId && { vendorId }),
      ...(minPrice !== undefined && { wholesalePrice: { gte: minPrice } }),
      ...(maxPrice !== undefined && { wholesalePrice: { lte: maxPrice } }),
      ...(isActive !== undefined && { isActive }),
    };
    
    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    // Get products with pagination
    const [products, total] = await Promise.all([
      (prisma).product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          inventoryImages: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      }),
      (prisma).product.count({ where }),
    ]);
    
    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.CREATE_PRODUCT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    
    // Create product
    const product = await (prisma).product.create({
      data: {
        ...data,
        tenantId: session.user.tenantId,
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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
