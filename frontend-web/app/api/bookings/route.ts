import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Booking } from '@/app/types/venue';

const BACKEND_URL = 'http://backend-web/api/bookings';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const itemsPerPage = searchParams.get('itemsPerPage') || '10';
    const venueId = searchParams.get('venue.id');
    const userId = searchParams.get('user.id');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startTime[after]');
    const endDate = searchParams.get('endTime[before]');
    
    // Build the URL with query parameters
    const url = new URL(BACKEND_URL);
    url.searchParams.set('page', page);
    url.searchParams.set('itemsPerPage', itemsPerPage);
    if (venueId) url.searchParams.set('venue.id', venueId);
    if (userId) url.searchParams.set('user.id', userId);
    if (status) url.searchParams.set('status', status);
    if (startDate) url.searchParams.set('startTime[after]', startDate);
    if (endDate) url.searchParams.set('endTime[before]', endDate);
    
    console.log(`Fetching bookings from backend at: ${url.toString()}`);
    
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
        { error: `Failed to fetch bookings from backend: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data: ApiResponse<Booking> = await response.json();
    console.log(`Successfully fetched ${data['hydra:totalItems']} bookings from backend`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bookings from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings from backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to create booking: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 