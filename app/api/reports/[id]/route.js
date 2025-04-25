import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requirePermission } from '../../../../lib/api-auth';
import { PERMISSIONS } from '../../../../lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_REPORTS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    const report = await prisma.reportDefinition.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId, // Ensure tenant isolation
      },
      include: {
        parameters: {
          orderBy: {
            parameterOrder: 'asc',
          },
        },
        layouts: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!report) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Report with ID ${id} not found`,
            details: { resourceType: 'report', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
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
    // Verify report exists and belongs to tenant
    const existingReport = await prisma.reportDefinition.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        parameters: true,
        layouts: true,
      },
    });
    
    if (!existingReport) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Report with ID ${id} not found`,
            details: { resourceType: 'report', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if it's a system report
    if (existingReport.isSystemReport) {
      return NextResponse.json(
        { 
          error: { 
            code: 'FORBIDDEN', 
            message: 'System reports cannot be modified',
          } 
        },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { reportName, reportDescription, reportCategory, reportType, isActive, parameters, layouts } = data;
    
    // Update report
    const updatedReport = await prisma.$transaction(async (tx) => {
      // Update report definition
      const report = await tx.reportDefinition.update({
        where: {
          id,
        },
        data: {
          reportName: reportName !== undefined ? reportName : existingReport.reportName,
          reportDescription: reportDescription !== undefined ? reportDescription : existingReport.reportDescription,
          reportCategory: reportCategory !== undefined ? reportCategory : existingReport.reportCategory,
          reportType: reportType !== undefined ? reportType : existingReport.reportType,
          isActive: isActive !== undefined ? isActive : existingReport.isActive,
        },
      });
      
      // Update parameters if provided
      if (parameters) {
        // Delete existing parameters
        await tx.reportParameter.deleteMany({
          where: {
            reportId: id,
          },
        });
        
        // Create new parameters
        await Promise.all(parameters.map((param, index) => 
          tx.reportParameter.create({
            data: {
              reportId: id,
              parameterName: param.parameterName,
              parameterLabel: param.parameterLabel,
              parameterType: param.parameterType,
              isRequired: param.isRequired || false,
              defaultValue: param.defaultValue || null,
              parameterOrder: index,
            },
          })
        ));
      }
      
      // Update layouts if provided
      if (layouts) {
        // Handle layouts - more complex as we want to preserve existing ones if not replaced
        for (const layout of layouts) {
          if (layout.id) {
            // Update existing layout
            await tx.reportLayout.update({
              where: {
                id: layout.id,
                reportId: id,
              },
              data: {
                layoutName: layout.layoutName,
                layoutConfig: layout.layoutConfig,
                isDefault: layout.isDefault,
              },
            });
          } else {
            // Create new layout
            await tx.reportLayout.create({
              data: {
                reportId: id,
                layoutName: layout.layoutName,
                layoutConfig: layout.layoutConfig || {},
                isDefault: layout.isDefault || false,
                createdById: session.user.id,
              },
            });
          }
        }
        
        // If we're setting a new default, unset any other defaults
        const hasNewDefault = layouts.some(l => l.isDefault);
        if (hasNewDefault) {
          await tx.reportLayout.updateMany({
            where: {
              reportId: id,
              id: {
                notIn: layouts.filter(l => l.id && l.isDefault).map(l => l.id),
              },
            },
            data: {
              isDefault: false,
            },
          });
        }
      }
      
      // Return updated report with all related data
      return tx.reportDefinition.findUnique({
        where: {
          id,
        },
        include: {
          parameters: {
            orderBy: {
              parameterOrder: 'asc',
            },
          },
          layouts: true,
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
    
    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
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
    // Verify report exists and belongs to tenant
    const report = await prisma.reportDefinition.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!report) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Report with ID ${id} not found`,
            details: { resourceType: 'report', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Check if it's a system report
    if (report.isSystemReport) {
      return NextResponse.json(
        { 
          error: { 
            code: 'FORBIDDEN', 
            message: 'System reports cannot be deleted',
          } 
        },
        { status: 403 }
      );
    }
    
    // Delete report and related entities in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete parameters
      await tx.reportParameter.deleteMany({
        where: {
          reportId: id,
        },
      });
      
      // Delete layouts
      await tx.reportLayout.deleteMany({
        where: {
          reportId: id,
        },
      });
      
      // Delete scheduled reports
      await tx.scheduledReport.deleteMany({
        where: {
          reportId: id,
        },
      });
      
      // Delete execution history
      await tx.reportExecutionHistory.deleteMany({
        where: {
          reportId: id,
        },
      });
      
      // Delete report definition
      await tx.reportDefinition.delete({
        where: {
          id,
        },
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
