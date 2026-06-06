export interface WeatherLocation {
  id: string;
  title: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface WeatherReading {
  id: number;
  locationId: string;
  resolution: string;
  validAt: string;
  tempC?: number | null;
  tempMinC?: number | null;
  tempMaxC?: number | null;
  rhPct?: number | null;
  mslHpa?: number | null;
  windKmh?: number | null;
  gustKmh?: number | null;
  windDir?: string | null;
  precipMm?: number | null;
  iconCode?: string | null;
  fetchedAt: string;
}

export interface ForecastWeatherResponse {
  location: WeatherLocation;
  forecast: WeatherReading[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getWeatherLocations(token: string) {
  return fetchApi<WeatherLocation[]>("/api/weather/app/locations", token);
}

export function getCurrentWeather(token: string, locationId: string) {
  return fetchApi<{
    location: WeatherLocation;
    current: WeatherReading | null;
  }>(`/api/weather/app/locations/${locationId}/current`, token);
}

export function getCurrentWeatherForecast(token: string, locationId: string) {
  return fetchApi<ForecastWeatherResponse>(
    `/api/weather/app/locations/${locationId}/forecast`,
    token,
  );
}
