export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Holiday {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
  coordinates: GeoPoint;
  coverImage: string;
  images: string[];
  tags: string[];
  highlights?: string[];
}
