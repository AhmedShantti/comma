import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function handleRequest(
  request: NextRequest,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
) {
  try {
    // Extract the path after /api/v1/settings
    const pathname = new URL(request.url).pathname;
    const settingsPath = pathname.replace('/api/v1/settings', '') || '';

    const backendUrl = `${BACKEND_URL}/api/v1/settings${settingsPath}`;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
    };

    // Add body for methods that support it
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const body = await request.json();
        fetchOptions.body = JSON.stringify(body);
      } catch (e) {
        // No body to parse
      }
    }

    const response = await fetch(backendUrl, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`[Settings API ${method}] Error:`, error);
    return NextResponse.json(
      { message: `Failed to process settings request`, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}
