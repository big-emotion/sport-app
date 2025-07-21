import { useState, useEffect } from "react";
import { CustomMarker, CreateMarkerData } from "@/types/markers";
import { markerService } from "@/services/markerService";
import { useAuth } from "@/contexts/AuthContext";

export function useCustomMarkers() {
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Charger les marqueurs quand l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserMarkers();
    } else {
      setMarkers([]);
      setError(null);
    }
  }, [isAuthenticated, user]);

  const loadUserMarkers = async () => {
    if (!isAuthenticated) {
      setMarkers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userMarkers = await markerService.getUserMarkers();
      setMarkers(userMarkers);
    } catch (error) {
      console.error("Failed to load user markers:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement des marqueurs"
      );
      setMarkers([]);
    } finally {
      setLoading(false);
    }
  };

  const addMarker = async (data: CreateMarkerData): Promise<CustomMarker> => {
    if (!isAuthenticated) {
      throw new Error("Connexion requise pour ajouter des marqueurs");
    }

    try {
      const newMarker = await markerService.createCustomMarker(data);
      setMarkers((prev) => [...prev, newMarker]);
      return newMarker;
    } catch (error) {
      console.error("Failed to add marker:", error);
      throw error;
    }
  };

  const removeMarker = async (markerId: string) => {
    if (!isAuthenticated) {
      throw new Error("Connexion requise pour supprimer des marqueurs");
    }

    try {
      await markerService.deleteMarker(markerId);
      setMarkers((prev) => prev.filter((marker) => marker.id !== markerId));
    } catch (error) {
      console.error("Failed to remove marker:", error);
      throw error;
    }
  };

  const updateMarker = async (
    markerId: string,
    data: Partial<CreateMarkerData>
  ): Promise<CustomMarker> => {
    if (!isAuthenticated) {
      throw new Error("Connexion requise pour modifier des marqueurs");
    }

    try {
      const updatedMarker = await markerService.updateMarker(markerId, data);
      setMarkers((prev) =>
        prev.map((marker) => (marker.id === markerId ? updatedMarker : marker))
      );
      return updatedMarker;
    } catch (error) {
      console.error("Failed to update marker:", error);
      throw error;
    }
  };

  const refreshMarkers = async () => {
    await loadUserMarkers();
  };

  const clearMarkers = () => {
    setMarkers([]);
    setError(null);
  };

  return {
    markers,
    loading,
    error,
    addMarker,
    removeMarker,
    updateMarker,
    refreshMarkers,
    clearMarkers,
    // Méthodes utilitaires
    getUserMarkerCount: () => markers.length,
    hasMarkers: () => markers.length > 0,
    isOwner: (markerId: string) => {
      const marker = markers.find((m) => m.id === markerId);
      return marker?.userId === user?.id;
    },
  };
}
