import { cookies } from 'next/headers';

import { SPORT_APP_AUTH_TOKEN } from '@/constants/cookies';

async function getLatLngFromAddress(
  address: string
): Promise<{ latitude: number | null; longitude: number | null }> {
  if (address === '') {
    return { latitude: null, longitude: null };
  }

  const url = `${process.env.NEXT_PUBLIC_MAPBOX_URL}${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Erreur lors du geocoding Mapbox:', res.statusText);

      return { latitude: null, longitude: null };
    }
    const data = await res.json();

    if (Boolean(data.features) && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;

      return { latitude, longitude };
    }

    return { latitude: null, longitude: null };
  } catch (error) {
    console.error('Erreur fetch geocoding Mapbox:', error);

    return { latitude: null, longitude: null };
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const { name, description, address, sportIds, sportId, sport } = body;

    const token = (await cookies()).get(SPORT_APP_AUTH_TOKEN)?.value;

    if (token == null) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sport-places`;

    const { latitude, longitude } = await getLatLngFromAddress(address);

    const finalPayload = {
      name,
      description,
      address,
      latitude,
      longitude,
      sportIds:
        sportIds ??
        ((sportId as string) !== ''
          ? [sportId]
          : (sport as string) !== ''
            ? [sport]
            : []),
    };

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('🔴 Erreur côté backend (non-200)', response.status, text);

      return new Response(JSON.stringify({ message: text }), {
        status: response.status,
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur attrapée dans le catch :', error);

    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
    });
  }
}
