export type VenueType = 
  | 'BASKETBALL'
  | 'FOOTBALL'
  | 'TENNIS'
  | 'SWIMMING'
  | 'RUNNING'
  | 'VOLLEYBALL'
  | 'GOLF'
  | 'OTHER';

export interface Sport {
  id: number;
  name: string;
  description?: string;
}

export interface VenueSport {
  id: number;
  venue: SportVenue;
  sport: Sport;
  isPrimary: boolean;
  description?: string;
  facilities?: string[];
}

export interface SportVenue {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  openingTime?: string;
  closingTime?: string;
  entranceFee?: string;
  description?: string;
  creationDate: string;
  publicationDate?: string;
  averageRating?: number;
  address?: string;
  venueType: VenueType;
  venueSports: VenueSport[];
  reviews: Review[];
  bookings: Booking[];
  facilities: Facility[];
  images: Image[];
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: User;
  venue: SportVenue;
}

export interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  user: User;
  venue: SportVenue;
}

export interface Facility {
  id: number;
  name: string;
  description?: string;
  type: string;
}

export interface Image {
  id: number;
  url: string;
  altText?: string;
  isMain: boolean;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ApiResponse<T> {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    '@type': string;
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:previous'?: string;
    'hydra:next'?: string;
  };
} 