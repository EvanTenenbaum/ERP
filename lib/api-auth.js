import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { hasPermission } from './rbac';

export async function authenticateRequest(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      ),
    };
  }
  
  return {
    authenticated: true,
    session,
  };
}

export async function checkPermission(session, permission) {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  return hasPermission(session.user.role, permission);
}

export async function requirePermission(request, permission) {
  const auth = await authenticateRequest(request);
  
  if (!auth.authenticated) {
    return {
      authorized: false,
      response: auth.response,
    };
  }
  
  const { session } = auth;
  
  if (!await checkPermission(session, permission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' } },
        { status: 403 }
      ),
    };
  }
  
  return {
    authorized: true,
    session,
  };
}
