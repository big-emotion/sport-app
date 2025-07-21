import Constants from "expo-constants";
import { secureStorage } from "./secureStorage";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function fetchFromApi<T>(
  slug: string,
  method: "GET" = "GET"
): Promise<T> {
  const url = getUrl(slug);
  const options = await getBaseOption(method);
  return await getJsonData(url, options);
}

export async function postToApi<T>(
  slug: string,
  method: "POST" = "POST",
  body: unknown = {}
): Promise<T> {
  const url = getUrl(slug);
  const options = await getBaseOption(method);
  options.body = JSON.stringify(body);
  return await getJsonData(url, options);
}

export async function putToApi<T>(
  slug: string,
  body: unknown = {}
): Promise<T> {
  const url = getUrl(slug);
  const options = await getBaseOption("PUT");
  options.body = JSON.stringify(body);
  return await getJsonData(url, options);
}

export async function deleteFromApi<T>(slug: string): Promise<T> {
  const url = getUrl(slug);
  const options = await getBaseOption("DELETE");
  return await getJsonData(url, options);
}

async function getBaseOption(method: HttpMethod): Promise<RequestInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Ajouter le token d'authentification si disponible
  try {
    const token = await secureStorage.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Failed to get token for API request:", error);
  }

  return {
    method,
    headers,
    cache: "no-store",
  };
}

function getUrl(slug: string): string {
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
      // Si erreur 401 (Unauthorized), on peut nettoyer le token
      if (response.status === 401) {
        await secureStorage.clearAll();
      }

      throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Une erreur est survenue"
    );
  }
}
