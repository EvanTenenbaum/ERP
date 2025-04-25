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
    const dashboard = await (prisma).dashboard.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
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
    
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
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
  const { id } = params;
  
  try {
    // Verify dashboard exists and belongs to tenant
    const existingDashboard = await (prisma).dashboard.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        widgets: true,
      },
    });
    
    if (!existingDashboard) {
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
    if (existingDashboard.isSystemDashboard) {
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
    const { dashboardName, dashboardDescription, isActive, widgets } = data;
    
    // Update dashboard
    const updatedDashboard = await (prisma).$transaction(async (tx) => {
      // Update dashboard definition
      const dashboard = await tx.dashboard.update({
        where: {
          id,
        },
        data: {
          dashboardName: dashboardName !== undefined ? dashboardName : existingDashboard.dashboardName,
          dashboardDescription: dashboardDescription !== undefined ? dashboardDescription : existingDashboard.dashboardDescription,
          isActive: isActive !== undefined ? isActive : existingDashboard.isActive,
        },
      });
      
      // Update widgets if provided
      if (widgets) {
        // Delete existing widgets
        await tx.dashboardWidget.deleteMany({
          where: {
            dashboardId: id,
          },
        });
        
        // Create new widgets
        await Promise.all(widgets.map(widget => 
          tx.dashboardWidget.create({
            data: {
              dashboardId: id,
              widgetType: widget.widgetType,
              widgetName: widget.widgetName,
              widgetConfig: widget.widgetConfig || {},
              positionX: widget.positionX || 0,
              positionY: widget.positionY || 0,
              width: widget.width || 1,
              height: widget.height || 1,
            },
          })
        ));
      }
      
      // Return updated dashboard with all related data
      return tx.dashboard.findUnique({
        where: {
          id,
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
    });
    
    return NextResponse.json(updatedDashboard);
  } catch (error) {
    console.error('Error updating dashboard:', error);
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
            message: 'System dashboards cannot be deleted',
          } 
        },
        { status: 403 }
      );
    }
    
    // Delete dashboard and related entities in a transaction
    await (prisma).$transaction(async (tx) => {
      // Delete widgets
      await tx.dashboardWidget.deleteMany({
        where: {
          dashboardId: id,
        },
      });
      
      // Delete user dashboards
      await tx.userDashboard.deleteMany({
        where: {
          dashboardId: id,
        },
      });
      
      // Delete dashboard
      await tx.dashboard.delete({
        where: {
          id,
        },
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
