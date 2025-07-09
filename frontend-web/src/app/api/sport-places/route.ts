import { cookies } from 'next/headers';

import { SPORT_APP_AUTH_TOKEN } from '@/constants/cookies';

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();

  try {
    const token = (await cookies()).get(SPORT_APP_AUTH_TOKEN)?.value;

    if (token == null) {
      return new Response(JSON.stringify({ message: 'Non autorisé' }), {
        status: 401,
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sport-places`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const { message } = await response.json();

      return new Response(JSON.stringify({ message }), {
        status: response.status,
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
    });
  }
}
