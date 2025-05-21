// lib/apiClient.ts
export async function fetchFromApi(
  slug: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<any> {
  const baseUrl = `${process.env.NEXT_PUBLIC_HTTP ?? 'http'}://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;
  const url = `${baseUrl}${slug}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} : ${response.statusText}`);
  }

  return response.json();
}
