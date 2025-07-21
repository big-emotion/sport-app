import { CustomMarker, CreateMarkerData } from "@/types/markers";
import { SportPlace, SportPlacesResponse } from "@/types/api";
import { postToApi, fetchFromApi, deleteFromApi, putToApi } from "./apiClient";
import { sportService } from "./sportService";

// Interface pour créer un SportPlace via l'API backend
interface CreateSportPlaceData {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  sportIds: string[];
}

export const markerService = {
  async createCustomMarker(data: CreateMarkerData): Promise<CustomMarker> {
    try {
      // Récupérer un sport par défaut
      const defaultSport = await sportService.getDefaultSport();
      if (!defaultSport) {
        throw new Error("Aucun sport disponible pour créer le marqueur");
      }

      // Préparer les données pour l'API backend
      const sportPlaceData: CreateSportPlaceData = {
        name: data.description || "Marqueur personnalisé",
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        sportIds: [defaultSport.id],
      };

      // Créer le sport place via l'API
      const sportPlace = await postToApi<SportPlace>(
        "/api/sport-places",
        "POST",
        sportPlaceData
      );

      // Convertir le SportPlace en CustomMarker
      const customMarker: CustomMarker = {
        id: sportPlace.id || "",
        latitude: sportPlace.latitude || 0,
        longitude: sportPlace.longitude || 0,
        address: sportPlace.address || "Adresse inconnue",
        description: sportPlace.description || sportPlace.name,
        userId: sportPlace.createdById || sportPlace.createdBy?.id || "",
        createdAt: sportPlace.createdAt || new Date().toISOString(),
        type: "custom",
      };

      return customMarker;
    } catch (error) {
      console.error("Failed to create custom marker:", error);
      throw new Error("Impossible de créer le marqueur personnalisé");
    }
  },

  async getUserMarkers(): Promise<CustomMarker[]> {
    try {
      // Récupérer tous les sport places et filtrer ceux créés par l'utilisateur
      const response = await fetchFromApi<SportPlacesResponse>(
        "/api/sport-places?limit=1000"
      );

      // Convertir les SportPlace en CustomMarker pour ceux créés par l'utilisateur
      const userMarkers: CustomMarker[] = response.sportPlaces
        .filter((place) => place.createdById || place.createdBy) // Filtrage côté client pour l'instant
        .map((place) => ({
          id: place.id || "",
          latitude: place.latitude || 0,
          longitude: place.longitude || 0,
          address: place.address || "Adresse inconnue",
          description: place.description || place.name,
          userId: place.createdById || place.createdBy?.id || "",
          createdAt: place.createdAt || new Date().toISOString(),
          type: "custom",
        }));

      return userMarkers;
    } catch (error) {
      console.error("Failed to fetch user markers:", error);
      throw new Error("Impossible de récupérer vos marqueurs");
    }
  },

  async getAllCustomMarkers(): Promise<CustomMarker[]> {
    try {
      // Pour l'instant, même logique que getUserMarkers
      // Plus tard on pourra distinguer les marqueurs custom des officiels
      return await this.getUserMarkers();
    } catch (error) {
      console.error("Failed to fetch all custom markers:", error);
      throw new Error("Impossible de récupérer les marqueurs");
    }
  },

  async deleteMarker(markerId: string): Promise<void> {
    try {
      await deleteFromApi(`/api/sport-places/${markerId}`);
    } catch (error) {
      console.error("Failed to delete marker:", error);
      throw new Error("Impossible de supprimer le marqueur");
    }
  },

  async updateMarker(
    markerId: string,
    data: Partial<CreateMarkerData>
  ): Promise<CustomMarker> {
    try {
      // Préparer les données pour la mise à jour
      const updateData: Partial<CreateSportPlaceData> = {};

      if (data.description) {
        updateData.name = data.description;
        updateData.description = data.description;
      }
      if (data.latitude) updateData.latitude = data.latitude;
      if (data.longitude) updateData.longitude = data.longitude;

      const sportPlace = await putToApi<SportPlace>(
        `/api/sport-places/${markerId}`,
        updateData
      );

      // Convertir le SportPlace mis à jour en CustomMarker
      const customMarker: CustomMarker = {
        id: sportPlace.id || "",
        latitude: sportPlace.latitude || 0,
        longitude: sportPlace.longitude || 0,
        address: sportPlace.address || "Adresse inconnue",
        description: sportPlace.description || sportPlace.name,
        userId: sportPlace.createdById || sportPlace.createdBy?.id || "",
        createdAt: sportPlace.createdAt || new Date().toISOString(),
        type: "custom",
      };

      return customMarker;
    } catch (error) {
      console.error("Failed to update marker:", error);
      throw new Error("Impossible de modifier le marqueur");
    }
  },
};
