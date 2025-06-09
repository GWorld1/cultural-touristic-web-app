/**
 * Authentication Profile API Route
 * 
 * This route handles user profile update requests. In a production environment,
 * this would integrate with Appwrite or another authentication service.
 * For now, it provides a mock implementation to demonstrate the flow.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract JWT token from Authorization header
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * PUT /api/auth/profile
 * 
 * Updates the current authenticated user's profile data.
 * Requires a valid JWT token in the Authorization header.
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, phone, bio } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && typeof phone === 'string' && phone.trim() !== '') {
      if (!/^\+?[\d\s\-\(\)]+$/.test(phone.trim())) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number' },
          { status: 400 }
        );
      }
    }

    // Validate bio length if provided
    if (bio && typeof bio === 'string' && bio.trim().length > 500) {
      return NextResponse.json(
        { error: 'Bio cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    // Mock profile update logic
    // In production, this would:
    // 1. Validate the JWT token with Appwrite
    // 2. Extract user ID from token
    // 3. Update user profile in Appwrite database
    // 4. Return updated user data

    console.log('Profile update request:', {
      name: name.trim(),
      phone: phone?.trim() || null,
      bio: bio?.trim() || null
    });

    // Mock successful update
    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating your profile' },
      { status: 500 }
    );
  }
}
