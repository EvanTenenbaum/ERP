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
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const includeSystem = searchParams.get('includeSystem') === 'true';
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      tenantId: session.user.tenantId,
      ...(category && { reportCategory: category }),
      ...(type && { reportType: type }),
      ...(!includeSystem && { isSystemReport: false }),
    };
    
    // Get reports with pagination
    const [reports, total] = await Promise.all([
      prisma.reportDefinition.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reportName: 'asc' },
        include: {
          parameters: true,
          layouts: {
            where: {
              isDefault: true,
            },
            take: 1,
          },
        },
      }),
      prisma.reportDefinition.count({ where }),
    ]);
    
    return NextResponse.json({
      data: reports,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
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
    const { reportName, reportDescription, reportCategory, reportType, parameters, layout } = data;
    
    // Create report definition with parameters and default layout
    const report = await prisma.reportDefinition.create({
      data: {
        tenantId: session.user.tenantId,
        reportName,
        reportDescription,
        reportCategory,
        reportType,
        isSystemReport: false,
        isActive: true,
        createdById: session.user.id,
        parameters: {
          create: parameters?.map((param, index) => ({
            parameterName: param.parameterName,
            parameterLabel: param.parameterLabel,
            parameterType: param.parameterType,
            isRequired: param.isRequired || false,
            defaultValue: param.defaultValue || null,
            parameterOrder: index,
          })) || [],
        },
        layouts: {
          create: layout ? [
            {
              layoutName: layout.layoutName || 'Default Layout',
              layoutConfig: layout.layoutConfig || {},
              isDefault: true,
              createdById: session.user.id,
            }
          ] : [],
        },
      },
      include: {
        parameters: true,
        layouts: {
          where: {
            isDefault: true,
          },
        },
      },
    });
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
