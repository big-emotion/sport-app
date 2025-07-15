import Constants from "expo-constants";

export async function fetchFromApi<T>(
  slug: string,
  method: "GET" = "GET"
): Promise<T> {
  const url = getUrl(slug);

  const options: RequestInit = getBaseOption(method);

  return await getJsonData(url, options);
}

export async function postToApi<T>(
  slug: string,
  method: "POST" = "POST",
  body: unknown = {}
): Promise<T> {
  const url = getUrl(slug);

  const options: RequestInit = getBaseOption(method);
  options.body = JSON.stringify(body);

  return await getJsonData(url, options);
}

function getBaseOption(method: "GET" | "POST"): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };
}

function getUrl(slug: string) {
  // Pour React Native/Expo, on utilise Constants.expoConfig
  const extra = Constants.expoConfig?.extra;

  // Configuration par défaut pour développement
  const httpProtocol = extra?.httpProtocol || "http";
  const backendUrl = extra?.backendUrl || "localhost";
  const backendPort = extra?.backendPort || "3001";

  const protocol = `${httpProtocol}://`;
  const port = backendPort ? `:${backendPort}` : "";

  const baseUrl = `${protocol}${backendUrl}${port}`;
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
    throw new Error(
      error instanceof Error ? error.message : "Une erreur est survenue"
    );
  }
}
