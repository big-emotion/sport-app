export interface SportPlace {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface SportPlacesResponse {
  member: SportPlace[];
}
