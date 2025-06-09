/**
 * Authentication Current User API Route
 * 
 * This route handles requests to get the current authenticated user's data.
 * In a production environment, this would integrate with Appwrite or another
 * authentication service. For now, it provides a mock implementation.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract and validate JWT token from Authorization header
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * GET /api/auth/me
 * 
 * Returns the current authenticated user's data.
 * Requires a valid JWT token in the Authorization header.
 */
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    // Mock token validation
    // In production, this would validate the JWT token with Appwrite
    if (!token.startsWith('mock_jwt_token_')) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Mock user data retrieval
    // In production, this would fetch user data from Appwrite
    const mockUser = {
      id: 'user_123',
      email: 'demo@example.com',
      name: 'Demo User',
      phone: '+1234567890',
      role: 'user'
    };

    return NextResponse.json(
      { user: mockUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
}
