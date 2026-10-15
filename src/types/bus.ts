/**
 * Type definitions aligned with Singapore Land Transport Authority (LTA) DataMall v3 APIs
 */

export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

// SEA (Seats Available), SDA (Standing Available), LSD (Limited Standing)
export type LoadLevel = 'SEA' | 'SDA' | 'LSD';

// SD (Single Deck), DD (Double Deck), BD (Bendy)
export type BusDeckType = 'SD' | 'DD' | 'BD';

// WAB (Wheelchair Accessible Bus), or empty
export type BusFeature = 'WAB' | '';

export interface NextBusInfo {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string; // ISO 8601 string
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: LoadLevel;
  Feature: BusFeature;
  Type: BusDeckType;
  // Extra telematics computed for UI
  vehiclePlate?: string;
  speedKmH?: number;
  distanceMeters?: number;
  stopsAway?: number;
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus: NextBusInfo | null;
  NextBus2: NextBusInfo | null;
  NextBus3: NextBusInfo | null;
  // Metadata for convenience
  category?: 'TRUNK' | 'FEEDER' | 'EXPRESS';
  destinationName?: string;
  originName?: string;
}

export interface BusArrivalData {
  odataMetadata?: string;
  BusStopCode: string;
  Services: BusServiceArrival[];
  timestamp: number;
}

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  mrtLines?: string[]; // e.g. ['NS', 'EW']
  hubRegion?: 'Central' | 'East' | 'West' | 'North' | 'North-East';
}

export interface RouteStop {
  StopSequence: number;
  BusStopCode: string;
  RoadName: string;
  Description: string;
  DistanceKm: number;
  Latitude: number;
  Longitude: number;
}

export interface BusRouteInfo {
  ServiceNo: string;
  Operator: BusOperator;
  Direction: 1 | 2;
  OriginCode: string;
  OriginName: string;
  DestinationCode: string;
  DestinationName: string;
  FirstBusWeekday: string;
  LastBusWeekday: string;
  FrequencyPeakMin: number;
  FrequencyOffPeakMin: number;
  Stops: RouteStop[];
}

export interface LiveBusTelemetry {
  id: string;
  serviceNo: string;
  operator: BusOperator;
  plate: string;
  latitude: number;
  longitude: number;
  bearing: number;
  speed: number;
  load: LoadLevel;
  type: BusDeckType;
  feature: BusFeature;
  nextStopCode: string;
  nextStopName: string;
  destinationName: string;
  etaMinutes: number;
  distanceMeters: number;
  updatedAt: number;
}

export interface BusAlarm {
  id: string;
  busStopCode: string;
  busStopName: string;
  serviceNo: string;
  triggerMinutes: number;
  createdAt: number;
  triggered: boolean;
}

export interface BackendConfig {
  useCustomBackend: boolean;
  backendUrl: string;
  ltaApiKey: string;
  refreshIntervalSec: number;
}
