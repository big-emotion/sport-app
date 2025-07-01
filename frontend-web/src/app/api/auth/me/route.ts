import { cookies } from 'next/headers';

import { SPORT_APP_AUTH_TOKEN } from '@/constants/cookies';

export async function GET(): Promise<Response> {
  const token = (await cookies()).get(SPORT_APP_AUTH_TOKEN)?.value;

  if (token == null) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const user = await res.json();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}
