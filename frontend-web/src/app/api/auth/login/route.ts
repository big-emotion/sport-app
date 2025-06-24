import { cookies } from 'next/headers';

import { SPORT_APP_AUTH_TOKEN } from '@/constants/cookies';

export async function POST(req: Request): Promise<Response> {
  const { email, password } = await req.json();

  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:3001/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const { message } = await response.json();

      return new Response(JSON.stringify({ message }), { status: 401 });
    }

    const { token, user } = await response.json();

    (await cookies()).set({
      name: SPORT_APP_AUTH_TOKEN,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
