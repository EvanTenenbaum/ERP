import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_SALES);
  
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
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sort') || 'saleDate';
    const sortOrder = searchParams.get('order') || 'desc';
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      tenantId: session.user.tenantId,
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { customer: { code: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(customerId && { customerId }),
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(startDate && { saleDate: { gte: new Date(startDate) } }),
      ...(endDate && { saleDate: { lte: new Date(endDate) } }),
    };
    
    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    // Get sales with pagination
    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          saleItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  strainType: true,
                },
              },
            },
          },
        },
      }),
      prisma.sale.count({ where }),
    ]);
    
    return NextResponse.json({
      data: sales,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.CREATE_SALE);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    const { customerId, saleDate, items, notes, status, paymentStatus, paymentDate } = data;
    
    // Validate required fields
    if (!customerId || !items || !items.length) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Customer ID and at least one item are required' } },
        { status: 400 }
      );
    }
    
    // Verify customer exists and belongs to tenant
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!customer) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Customer with ID ${customerId} not found`,
            details: { resourceType: 'customer', resourceId: customerId }
          } 
        },
        { status: 404 }
      );
    }
    
    // Generate invoice number
    const lastSale = await prisma.sale.findFirst({
      where: {
        tenantId: session.user.tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        invoiceNumber: true,
      },
    });
    
    let invoiceNumber = 'INV-1001';
    if (lastSale && lastSale.invoiceNumber) {
      const lastNumber = parseInt(lastSale.invoiceNumber.split('-')[1]);
      invoiceNumber = `INV-${lastNumber + 1}`;
    }
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      total += parseFloat(item.price) * parseFloat(item.quantity);
    }
    
    // Create sale and items in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create sale
      const newSale = await tx.sale.create({
        data: {
          tenantId: session.user.tenantId,
          customerId,
          saleDate: saleDate ? new Date(saleDate) : new Date(),
          invoiceNumber,
          total,
          notes,
          status: status || 'pending',
          paymentStatus: paymentStatus || 'unpaid',
          paymentDate: paymentDate ? new Date(paymentDate) : null,
          saleItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: parseFloat(item.quantity),
              price: parseFloat(item.price),
              discount: item.discount ? parseFloat(item.discount) : 0,
              notes: item.notes,
            })),
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          saleItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  strainType: true,
                },
              },
            },
          },
        },
      });
      
      // Reduce inventory for each item
      for (const item of items) {
        if (item.locationId) {
          const inventoryRecord = await tx.inventoryRecord.findFirst({
            where: {
              productId: item.productId,
              locationId: item.locationId,
              tenantId: session.user.tenantId,
            },
          });
          
          if (inventoryRecord) {
            const updatedQuantity = inventoryRecord.quantity - parseFloat(item.quantity);
            
            if (updatedQuantity <= 0) {
              await tx.inventoryRecord.delete({
                where: {
                  id: inventoryRecord.id,
                },
              });
            } else {
              await tx.inventoryRecord.update({
                where: {
                  id: inventoryRecord.id,
                },
                data: {
                  quantity: updatedQuantity,
                },
              });
            }
          }
        }
      }
      
      return newSale;
    });
    
    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
