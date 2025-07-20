import { useState, useEffect } from "react";
import { Region } from "react-native-maps";
import { NavigationParams } from "@/services/platformService";

export function useMapNavigation() {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

  const updateRegion = (region: Region) => {
    setCurrentRegion(region);
  };

  const getCurrentNavigationParams = (): NavigationParams | null => {
    if (!currentRegion) return null;

    return {
      latitude: currentRegion.latitude,
      longitude: currentRegion.longitude,
      zoom: calculateZoomFromDelta(currentRegion.latitudeDelta),
    };
  };

  return {
    currentRegion,
    updateRegion,
    getCurrentNavigationParams,
  };
}

// Fonction utilitaire pour convertir latitudeDelta en zoom level approximatif
function calculateZoomFromDelta(latitudeDelta: number): number {
  // Formule approximative : zoom = log2(360 / latitudeDelta)
  const zoom = Math.log2(360 / latitudeDelta);
  return Math.max(1, Math.min(20, Math.round(zoom)));
}
