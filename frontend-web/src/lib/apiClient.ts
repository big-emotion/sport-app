export async function fetchFromApi<T>(slug: string, method: 'GET'): Promise<T> {
  const url = getUrl(slug);

  const options: RequestInit = getBaseOption(method);

  return await getJsonData(url, options);
}

export async function postToApi<T>(
  slug: string,
  method: 'POST' = 'POST',
  body: unknown = {} //TODO: type body
): Promise<T> {
  const url = getUrl(slug);

  const options: RequestInit = getBaseOption(method);

  options.body = JSON.stringify(body);

  return await getJsonData(url, options);
}

function getBaseOption(method: 'GET' | 'POST'): RequestInit {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  };
}

function getUrl(slug: string) {
  const protocol = process.env.NEXT_PUBLIC_HTTP
    ? `${process.env.NEXT_PUBLIC_HTTP}://`
    : '';
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT
    ? `:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
    : '';
  const baseUrl = `${protocol}${process.env.NEXT_PUBLIC_BACKEND_URL}${port}`;
  const url = `${baseUrl}${slug}`;

  return url;
}

async function getJsonData(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Erreur ${error}`);
  }
}
