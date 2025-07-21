import * as Linking from "expo-linking";
import Constants from "expo-constants";

export interface NavigationParams {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

export const platformService = {
  /**
   * Ouvre la version web de l'application depuis le mobile
   */
  async openWebVersion(params?: NavigationParams): Promise<void> {
    try {
      const webAppUrl =
        Constants.expoConfig?.extra?.webAppUrl || "http://localhost:3001";

      // Construire l'URL avec les paramètres
      const url = new URL("/carte-interactive", webAppUrl);

      if (params?.latitude && params?.longitude) {
        url.searchParams.set("lat", params.latitude.toString());
        url.searchParams.set("lng", params.longitude.toString());
      }

      if (params?.zoom) {
        url.searchParams.set("zoom", params.zoom.toString());
      }

      // Ouvrir dans le navigateur
      const canOpen = await Linking.canOpenURL(url.toString());
      if (canOpen) {
        await Linking.openURL(url.toString());
      } else {
        throw new Error("Impossible d'ouvrir l'URL dans le navigateur");
      }
    } catch (error) {
      console.error("Failed to open web version:", error);
      throw new Error("Impossible d'ouvrir la version web");
    }
  },

  /**
   * Génère un lien vers l'application mobile (pour usage côté web)
   */
  generateMobileLink(params?: NavigationParams): string {
    const baseUrl = "sportapp://map";
    const url = new URL(baseUrl);

    if (params?.latitude && params?.longitude) {
      url.searchParams.set("lat", params.latitude.toString());
      url.searchParams.set("lng", params.longitude.toString());
    }

    if (params?.zoom) {
      url.searchParams.set("zoom", params.zoom.toString());
    }

    return url.toString();
  },

  /**
   * Génère un lien universel avec fallback (pour usage côté web)
   */
  generateUniversalLink(params?: NavigationParams): string {
    const webAppUrl =
      Constants.expoConfig?.extra?.webAppUrl || "http://localhost:3001";
    const url = new URL("/app-redirect", webAppUrl);

    if (params?.latitude && params?.longitude) {
      url.searchParams.set("lat", params.latitude.toString());
      url.searchParams.set("lng", params.longitude.toString());
    }

    if (params?.zoom) {
      url.searchParams.set("zoom", params.zoom.toString());
    }

    return url.toString();
  },

  /**
   * Parse les paramètres d'URL pour l'app mobile
   */
  parseUrlParams(url: string): NavigationParams | null {
    try {
      const parsed = new URL(url);
      const lat = parsed.searchParams.get("lat");
      const lng = parsed.searchParams.get("lng");
      const zoom = parsed.searchParams.get("zoom");

      if (lat && lng) {
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          zoom: zoom ? parseFloat(zoom) : undefined,
        };
      }

      return null;
    } catch (error) {
      console.error("Failed to parse URL params:", error);
      return null;
    }
  },
};
