import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_REPORTS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify dashboard exists and belongs to tenant
    const dashboard = await (prisma).dashboard.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!dashboard) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Dashboard with ID ${id} not found`,
            details: { resourceType: 'dashboard', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Get widgets for the dashboard
    const widgets = await (prisma).dashboardWidget.findMany({
      where: {
        dashboardId: id,
      },
      orderBy: [
        { positionY: 'asc' },
        { positionX: 'asc' },
      ],
    });
    
    return NextResponse.json(widgets);
  } catch (error) {
    console.error('Error fetching dashboard widgets:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_TENANT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify dashboard exists and belongs to tenant
    const dashboard = await (prisma).dashboard.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!dashboard) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Dashboard with ID ${id} not found`,
            details: { resourceType: 'dashboard', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if it's a system dashboard
    if (dashboard.isSystemDashboard) {
      return NextResponse.json(
        { 
          error: { 
            code: 'FORBIDDEN', 
            message: 'System dashboards cannot be modified',
          } 
        },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { widgetType, widgetName, widgetConfig, positionX, positionY, width, height } = data;
    
    // Create widget
    const widget = await (prisma).dashboardWidget.create({
      data: {
        dashboardId: id,
        widgetType,
        widgetName,
        widgetConfig: widgetConfig || {},
        positionX: positionX || 0,
        positionY: positionY || 0,
        width: width || 1,
        height: height || 1,
      },
    });
    
    return NextResponse.json(widget);
  } catch (error) {
    console.error('Error creating dashboard widget:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
