import { cookies } from 'next/headers';

import { SPORT_APP_AUTH_TOKEN } from '@/constants/cookies';

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const { name, description, address, sport } = body;

    const token = (await cookies()).get(SPORT_APP_AUTH_TOKEN)?.value;

    if (token == null) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sport-places`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ou autre méthode si ton backend l'exige
        },
        body: JSON.stringify({ name, description, address, sport }),
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
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
    });
  }
}
