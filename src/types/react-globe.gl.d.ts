/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-globe.gl' {
  import { MutableRefObject } from 'react';

  export interface GlobeMethods {
    pointOfView: (pov: { lat: number; lng: number; altitude: number }, duration?: number) => void;
    controls: () => any;
  }

  export interface GlobeProps {
    ref?: MutableRefObject<any>;
    globeImageUrl?: string;
    backgroundColor?: string;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    htmlElementsData?: any[];
    htmlLat?: string | ((d: any) => number);
    htmlLng?: string | ((d: any) => number);
    htmlElement?: string | ((d: any) => HTMLElement);
    htmlAltitude?: number | ((d: any) => number);
    onHtmlClick?: (d: any, event: MouseEvent) => void;
    htmlTransitionDuration?: number;
    onGlobeClick?: (coords: { lat: number; lng: number }, event: MouseEvent) => void;
    onGlobeReady?: () => void;
    width?: number;
    height?: number;
    [key: string]: any;
  }

  export default function GlobeGL(props: GlobeProps): JSX.Element;
}
