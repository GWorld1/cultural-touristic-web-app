/**
 * Password Reset Request API Route
 * 
 * This route handles password reset requests. In a production environment,
 * this would integrate with Appwrite or another authentication service
 * to send password reset emails. For now, it provides a mock implementation.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/password/reset-request
 * 
 * Initiates a password reset process by sending a reset email to the user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Mock password reset logic
    // In production, this would:
    // 1. Check if user exists in Appwrite
    // 2. Generate a secure reset token
    // 3. Send reset email with token
    
    console.log(`Password reset requested for email: ${email}`);

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json(
      { message: 'Password reset email sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
