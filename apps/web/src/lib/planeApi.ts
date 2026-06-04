export interface Planes {
  hex: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude?: string;
  origin_country: string;
  heading: number;
  ground_speed: number;
}

export interface PlaneRoute {
  hex: string;
  callsign: string;
  airline: string; // Fixed typo from 'airling'
  flying_from_city: string;
  flying_from_country: string;
  flying_to_city: string;
  flying_to_country: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(path: string, token: string): Promise<T> {
  console.log("Req: ", `${API_BASE_URL}${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
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

export function getPlaneRouteInfo(token: string, hex: string, callsign: string) {
  const cleanCallsign = encodeURIComponent(callsign.trim());
  const cleanHex = encodeURIComponent(hex.trim());
  
  return fetchApi<any>(
    `/api/planes/app/routes/info?hex=${cleanHex}&callsign=${cleanCallsign}`,
    token
  );
}