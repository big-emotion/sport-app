export interface SportPlace {
  id?: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string; // ID de l'utilisateur créateur
  type?: "official" | "custom"; // Champ local pour différencier
  // Relations du backend
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  sports?: Array<{
    sport: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  _count?: {
    events: number;
    reviews: number;
    favorites: number;
  };
}

export interface SportPlacesResponse {
  sportPlaces: SportPlace[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MapConfig {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markerImage: any;
}

// Exports des nouveaux types
export * from "./auth";
export * from "./markers";
