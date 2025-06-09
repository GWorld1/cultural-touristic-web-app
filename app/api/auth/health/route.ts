/**
 * Authentication Health Check API Route
 * 
 * This route provides a simple health check for the authentication service.
 * It can be used to verify that the authentication API is running and accessible.
 */

import { NextResponse } from 'next/server';

/**
 * GET /api/auth/health
 * 
 * Returns a simple health check response to verify the authentication service is running.
 */
export async function GET() {
  try {
    return NextResponse.json(
      { 
        message: 'Authentication service is running',
        status: 'healthy',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        error: 'Authentication service is not available',
        status: 'unhealthy'
      },
      { status: 500 }
    );
  }
}
