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
