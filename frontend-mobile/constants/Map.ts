import { MapConfig } from "../types/api";

export const MAP_CONFIG: MapConfig = {
  initialRegion: {
    latitude: 48.8584, // Paris - même que le frontend web
    longitude: 2.2945,
    latitudeDelta: 0.0922, // Zoom adapté pour mobile
    longitudeDelta: 0.0421,
  },
  markerImage: null, // On utilisera l'icône par défaut pour commencer
};

export const USER_LOCATION_CONFIG = {
  radius: 8,
  color: "#2563eb",
  fillColor: "#3b82f6",
  fillOpacity: 0.8,
  strokeWidth: 2,
};
