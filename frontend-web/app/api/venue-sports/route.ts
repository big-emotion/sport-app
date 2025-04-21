import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, VenueSport } from '@/app/types/venue';

const BACKEND_URL = 'http://backend-web/api/venue-sports';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const itemsPerPage = searchParams.get('itemsPerPage') || '10';
    const venueId = searchParams.get('venue.id');
    const sportId = searchParams.get('sport.id');
    
    // Build the URL with query parameters
    const url = new URL(BACKEND_URL);
    url.searchParams.set('page', page);
    url.searchParams.set('itemsPerPage', itemsPerPage);
    if (venueId) url.searchParams.set('venue.id', venueId);
    if (sportId) url.searchParams.set('sport.id', sportId);
    
    console.log(`Fetching venue sports from backend at: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch venue sports from backend: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data: ApiResponse<VenueSport> = await response.json();
    console.log(`Successfully fetched ${data['hydra:totalItems']} venue sports from backend`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching venue sports from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venue sports from backend' },
      { status: 500 }
    );
  }
} 