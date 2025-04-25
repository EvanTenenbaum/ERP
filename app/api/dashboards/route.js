import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requirePermission } from '../../../lib/api-auth';
import { PERMISSIONS } from '../../../lib/rbac';

export async function GET(request) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_REPORTS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { searchParams } = new URL(request.url);
  
  try {
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeSystem = searchParams.get('includeSystem') === 'true';
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      tenantId: session.user.tenantId,
      ...(!includeSystem && { isSystemDashboard: false }),
    };
    
    // Get dashboards with pagination
    const [dashboards, total] = await Promise.all([
      prisma.dashboard.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dashboardName: 'asc' },
        include: {
          widgets: {
            orderBy: [
              { positionY: 'asc' },
              { positionX: 'asc' },
            ],
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.dashboard.count({ where }),
    ]);
    
    return NextResponse.json({
      data: dashboards,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_TENANT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    const { dashboardName, dashboardDescription, widgets = [] } = data;
    
    // Create dashboard with widgets
    const dashboard = await prisma.dashboard.create({
      data: {
        tenantId: session.user.tenantId,
        dashboardName,
        dashboardDescription,
        isSystemDashboard: false,
        isActive: true,
        createdById: session.user.id,
        widgets: {
          create: widgets.map(widget => ({
            widgetType: widget.widgetType,
            widgetName: widget.widgetName,
            widgetConfig: widget.widgetConfig || {},
            positionX: widget.positionX || 0,
            positionY: widget.positionY || 0,
            width: widget.width || 1,
            height: widget.height || 1,
          })),
        },
      },
      include: {
        widgets: {
          orderBy: [
            { positionY: 'asc' },
            { positionX: 'asc' },
          ],
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Error creating dashboard:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
