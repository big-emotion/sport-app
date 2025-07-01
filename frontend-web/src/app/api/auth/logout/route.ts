import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SPORT_APP_AUTH_TOKEN } from '@/constants/cookies';

export async function POST(): Promise<NextResponse> {
  (await cookies()).set({
    name: SPORT_APP_AUTH_TOKEN,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}
