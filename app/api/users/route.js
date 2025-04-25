import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/dynamic-prisma';
import { requirePermission } from '@/lib/api-auth';
import { PERMISSIONS } from '@/lib/rbac';
import bcrypt from 'bcrypt';

export async function GET(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_USERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const users = await (await getPrismaClient()).user.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requirePermission(request, PERMISSIONS.MANAGE_USERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  
  try {
    const data = await request.json();
    
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    // Create user
    const user = await (await getPrismaClient()).user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash,
        tenantId: session.user.tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
