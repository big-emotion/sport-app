export interface SportPlace {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
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
