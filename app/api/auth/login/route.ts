/**
 * Authentication Login API Route
 * 
 * This route handles user login requests. In a production environment,
 * this would integrate with Appwrite or another authentication service.
 * For now, it provides a mock implementation to demonstrate the flow.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/login
 * 
 * Authenticates a user with email and password.
 * Returns user data, JWT token, and session ID on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Mock authentication logic
    // In production, this would integrate with Appwrite
    if (email === 'demo@example.com' && password === 'password123') {
      // Mock successful authentication
      const mockUser = {
        id: 'user_123',
        email: email,
        name: 'Demo User',
        phone: '+1234567890',
        role: 'user'
      };

      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockSessionId = 'session_' + Date.now();

      return NextResponse.json(
        {
          message: 'Login successful',
          user: mockUser,
          token: mockToken,
          sessionId: mockSessionId
        },
        { status: 200 }
      );
    } else {
      // Mock authentication failure
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
