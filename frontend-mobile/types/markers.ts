export interface CustomMarker {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
  userId: string;
  createdAt: string;
  type: "custom" | "official";
}

export interface CreateMarkerData {
  latitude: number;
  longitude: number;
  description?: string;
  address?: string;
}

export interface ReverseGeocodeResult {
  address: string;
  city?: string;
  country?: string;
}
