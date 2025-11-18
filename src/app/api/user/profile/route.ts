import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const sessions = await db.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }
      }
    });

    if (!sessions) {
      return null;
    }

    return sessions;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userSession = await authenticateRequest(request);
    
    if (!userSession) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: userSession.userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!userData) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userSession = await authenticateRequest(request);
    
    if (!userSession) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, image } = body;

    if (!name && phone === undefined && image === undefined) {
      return NextResponse.json({ 
        error: 'At least one field must be provided for update',
        code: 'NO_FIELDS_PROVIDED' 
      }, { status: 400 });
    }

    const updates: any = {
      updatedAt: new Date()
    };

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return NextResponse.json({ 
          error: 'Name cannot be empty',
          code: 'INVALID_NAME' 
        }, { status: 400 });
      }
      updates.name = trimmedName;
    }

    if (phone !== undefined) {
      if (phone === null) {
        updates.phone = null;
      } else {
        const trimmedPhone = phone.trim();
        if (!trimmedPhone) {
          return NextResponse.json({ 
            error: 'Phone cannot be empty string',
            code: 'INVALID_PHONE' 
          }, { status: 400 });
        }
        updates.phone = trimmedPhone;
      }
    }

    if (image !== undefined) {
      if (image === null) {
        updates.image = null;
      } else {
        try {
          new URL(image);
          updates.image = image;
        } catch {
          return NextResponse.json({ 
            error: 'Invalid image URL format',
            code: 'INVALID_IMAGE_URL' 
          }, { status: 400 });
        }
      }
    }

    const existingUser = await db.user.findUnique({
      where: { id: userSession.userId }
    });

    if (!existingUser) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id: userSession.userId },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}