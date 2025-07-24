export interface SportPlace {
  id?: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
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
