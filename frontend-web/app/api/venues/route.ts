import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For server-side code, we use the internal Docker network URL
    const backendUrl = 'http://backend-web/api/sport-venues';
    
    console.log(`Fetching data from backend at: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // This is important for server-side fetching
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch data from backend: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data['hydra:totalItems']} venues from backend`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching venues from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}