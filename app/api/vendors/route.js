import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_VENDORS);
  
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
    const isActive = searchParams.get('isActive') === 'true';
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      tenantId: session.user.tenantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(isActive !== undefined && { isActive }),
    };
    
    // Get vendors with pagination
    const [vendors, total] = await Promise.all([
      (prisma).vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      (prisma).vendor.count({ where }),
    ]);
    
    return NextResponse.json({
      data: vendors,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.CREATE_VENDOR);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    
    // Create vendor
    const vendor = await (prisma).vendor.create({
      data: {
        ...data,
        tenantId: session.user.tenantId,
      },
    });
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    
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
