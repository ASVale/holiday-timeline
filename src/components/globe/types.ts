import type { GeoPoint } from "@/data/types";

export interface GlobeMarkerData {
  id: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  isActive?: boolean;
}

export interface GlobeAdapterProps {
  markers: GlobeMarkerData[];
  activeHolidayId?: string | null;
  focusPoint?: GeoPoint | null;
  onMarkerClick?: (id: string) => void;
  onMarkerHover?: (marker: GlobeMarkerData | null) => void;
  onGlobeClick?: () => void;
  className?: string;
}
