import { NextRequest, NextResponse } from 'next/server';

// Use the environment variable set in docker-compose.yml
const BACKEND_URL = 'http://localhost:8080/api/sport_venues';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const itemsPerPage = searchParams.get('itemsPerPage') || '10';
    const name = searchParams.get('name');
    const venueType = searchParams.get('venueType');
    
    // Build the URL with query parameters
    const url = new URL(BACKEND_URL);
    url.searchParams.set('page', page);
    url.searchParams.set('itemsPerPage', itemsPerPage);
    if (name) url.searchParams.set('name', name);
    if (venueType) url.searchParams.set('venueType', venueType);
    
    console.log(`Fetching data from backend at: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/ld+json',
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
    
    // Check if we received the expected data structure
    if (data && typeof data === 'object') {
      if (data['hydra:member'] && Array.isArray(data['hydra:member'])) {
        console.log(`Successfully fetched ${data['hydra:totalItems']} venues from backend`);
        return NextResponse.json(data);
      } else {
        console.log('Data received but not in expected format. Received:', 
          Object.keys(data).join(', '));
          
        // If the data is not in hydra format but is an array, return directly
        if (Array.isArray(data)) {
          console.log(`Successfully fetched ${data.length} venues from backend (array format)`);
          return NextResponse.json({ 'hydra:member': data, 'hydra:totalItems': data.length });
        }
        
        // Try to normalize the response if possible
        const normalizedData = {
          'hydra:member': Array.isArray(data) ? data : [],
          'hydra:totalItems': Array.isArray(data) ? data.length : 0
        };
        
        return NextResponse.json(normalizedData);
      }
    } else {
      // If we received something unexpected, create an empty hydra response
      console.error('Received invalid data format from backend:', typeof data);
      return NextResponse.json({ 
        'hydra:member': [], 
        'hydra:totalItems': 0,
        'error': 'Received invalid data format from backend'
      });
    }
  } catch (error) {
    console.error('Error fetching venues from backend:', error);
    return NextResponse.json(
      { 
        'hydra:member': [],
        'hydra:totalItems': 0,
        error: 'Failed to fetch data from backend' 
      },
      { status: 500 }
    );
  }
}