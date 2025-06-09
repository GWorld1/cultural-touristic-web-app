/**
 * Authentication Registration API Route
 * 
 * This route handles user registration requests. In a production environment,
 * this would integrate with Appwrite or another authentication service.
 * For now, it provides a mock implementation to demonstrate the flow.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/register
 * 
 * Registers a new user account.
 * Returns success message and basic user data on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
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
    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Mock registration logic
    // In production, this would integrate with Appwrite
    
    // Check if email already exists (mock check)
    if (email === 'existing@example.com') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Mock successful registration
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email,
      name: name.trim()
    };

    return NextResponse.json(
      {
        message: 'User registered successfully. Please verify your email.',
        user: mockUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
