export interface Planes {
  hex: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude?: string;
  originCountry: string;
  heading: number;
  groundSpeed: number;
  airline?: string | null;
  flyingFromCity?: string | null;
  flyingFromCountry?: string | null;
  flyingToCity?: string | null;
  flyingToCountry?: string | null;
}

export interface LocationQuery{
  latitude: number;
  longitude: number;
  radius: number;
}

export interface PlaneRoute {
  hex: string;
  callsign: string;
  airline: string;
  flyingFromCity: string;
  flyingFromCountry: string;
  flyingToCity: string;
  flyingToCountry: string;
}

export interface Snapshot {
  id: number;
  snapshotTime: string;
  aircraftCount: number;
}

export interface PlaneSnapshot {
  id: number;
  snapshotId: number;
  snapshotTime: string;
  hex: string;
  callsign: string | null;
  originCountry: string | null;
  latitude: number | null;
  longitude: number | null;
  baroAltitude: number | null;
  onGround: boolean;
  groundSpeed: number | null;
  heading: number | null;
  verticalRate: number | null;
  spi: boolean;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface LatestSnapshotResponse {
  latestSnapshot: Snapshot | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(
  path: string,
  token: string,
  signal?: AbortSignal,
): Promise<T> {
  console.log("Req: ", `${API_BASE_URL}${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Status:", response.status);

  if (!response.ok) {
    const body = await response.text();
    console.error("Request failed:", response.status, body);
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getPlaneLocations(token: string) {
  return fetchApi<any>("/api/planes/app/live", token);
}

export function getNearbyPlanes(token: string, coords: LocationQuery){
  const radius = Math.floor(coords.radius * 1000).toString();
  const lon = coords.longitude;
  const lat = coords.latitude;

  return fetchApi<any>(`/api/planes/app/nearby?latitude=${lat}&longitude=${lon}&radius=${radius}`, token);
}

export function getSnapshots(token: string) {
  return fetchApi<ApiListResponse<Snapshot>>(
    "/api/planes/app/snapshots",
    token,
  );
}

export function getLatestSnapshot(token: string) {
  return fetchApi<LatestSnapshotResponse>(
    "/api/planes/app/snapshots/latest",
    token,
  );
}

export function getPlanesFromSnapshot(
  token: string,
  snapshotId: number,
  signal?: AbortSignal,
) {
  return fetchApi<ApiListResponse<PlaneSnapshot>>(
    `/api/planes/app/plane-snapshots/${snapshotId}`,
    token,
    signal,
  );
}

export function getPlaneRouteInfo(
  token: string,
  hex: string,
  callsign: string,
) {
  const cleanCallsign = encodeURIComponent(callsign.trim());
  const cleanHex = encodeURIComponent(hex.trim());

  return fetchApi<any>(
    `/api/planes/app/routes/info?hex=${cleanHex}&callsign=${cleanCallsign}`,
    token,
  );
}
