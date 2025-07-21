import * as Location from "expo-location";
import { ReverseGeocodeResult } from "@/types/markers";

export const geocodingService = {
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodeResult> {
    try {
      // Vérifier les permissions de localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return { address: "Permissions de localisation requises" };
      }

      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const result = results[0];

        // Construire l'adresse de manière robuste
        const addressParts = [result.streetNumber, result.street].filter(
          Boolean
        );

        const cityParts = [result.postalCode, result.city].filter(Boolean);

        const fullAddress = [addressParts.join(" "), cityParts.join(" ")]
          .filter(Boolean)
          .join(", ");

        return {
          address: fullAddress || "Adresse inconnue",
          city: result.city || undefined,
          country: result.country || undefined,
        };
      }

      return { address: "Adresse inconnue" };
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return {
        address:
          "Erreur de géocodage - Coordonnées: " +
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };
    }
  },

  async checkLocationPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Failed to check location permissions:", error);
      return false;
    }
  },

  async requestLocationPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Failed to request location permissions:", error);
      return false;
    }
  },
};
