import { cookies } from 'next/headers';

export async function POST(req: Request): Promise<Response> {
  const { email, password } = await req.json();

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();

      return new Response(JSON.stringify({ message }), { status: 401 });
    }

    const { token, user } = await response.json();

    (await cookies()).set({
      name: 'token',
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
    return new Response(
      JSON.stringify({ message: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
}
