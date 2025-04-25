import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/dynamic-prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_REPORTS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id, widgetId } = params;
  
  try {
    // Verify dashboard exists and belongs to tenant
    const dashboard = await (await getPrismaClient()).dashboard.findUnique({
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
    
    // Get widget
    const widget = await (await getPrismaClient()).dashboardWidget.findUnique({
      where: {
        id: widgetId,
        dashboardId: id,
      },
    });
    
    if (!widget) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Widget with ID ${widgetId} not found`,
            details: { resourceType: 'widget', resourceId: widgetId }
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(widget);
  } catch (error) {
    console.error('Error fetching dashboard widget:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_TENANT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id, widgetId } = params;
  
  try {
    // Verify dashboard exists and belongs to tenant
    const dashboard = await (await getPrismaClient()).dashboard.findUnique({
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
    
    // Verify widget exists
    const existingWidget = await (await getPrismaClient()).dashboardWidget.findUnique({
      where: {
        id: widgetId,
        dashboardId: id,
      },
    });
    
    if (!existingWidget) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Widget with ID ${widgetId} not found`,
            details: { resourceType: 'widget', resourceId: widgetId }
          } 
        },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    const { widgetType, widgetName, widgetConfig, positionX, positionY, width, height } = data;
    
    // Update widget
    const widget = await (await getPrismaClient()).dashboardWidget.update({
      where: {
        id: widgetId,
      },
      data: {
        widgetType: widgetType !== undefined ? widgetType : existingWidget.widgetType,
        widgetName: widgetName !== undefined ? widgetName : existingWidget.widgetName,
        widgetConfig: widgetConfig !== undefined ? widgetConfig : existingWidget.widgetConfig,
        positionX: positionX !== undefined ? positionX : existingWidget.positionX,
        positionY: positionY !== undefined ? positionY : existingWidget.positionY,
        width: width !== undefined ? width : existingWidget.width,
        height: height !== undefined ? height : existingWidget.height,
      },
    });
    
    return NextResponse.json(widget);
  } catch (error) {
    console.error('Error updating dashboard widget:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_TENANT);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id, widgetId } = params;
  
  try {
    // Verify dashboard exists and belongs to tenant
    const dashboard = await (await getPrismaClient()).dashboard.findUnique({
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
    
    // Verify widget exists
    const widget = await (await getPrismaClient()).dashboardWidget.findUnique({
      where: {
        id: widgetId,
        dashboardId: id,
      },
    });
    
    if (!widget) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Widget with ID ${widgetId} not found`,
            details: { resourceType: 'widget', resourceId: widgetId }
          } 
        },
        { status: 404 }
      );
    }
    
    // Delete widget
    await (await getPrismaClient()).dashboardWidget.delete({
      where: {
        id: widgetId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dashboard widget:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
