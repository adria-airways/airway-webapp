import { useEffect, useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useAuth } from "@clerk/clerk-react";
import L from "leaflet";
import { WEATHER_DOT_STYLE } from "../mapStyles";

import {
  getCurrentWeather,
  getWeatherLocations,
  type WeatherLocation,
  type WeatherReading,
} from "../lib/weatherApi";

const weatherStationIcon = L.divIcon({
  html: `<div style="
    width: ${WEATHER_DOT_STYLE.width}px;
    height: ${WEATHER_DOT_STYLE.height}px;
    border-radius: ${WEATHER_DOT_STYLE.borderRadius};
    background: ${WEATHER_DOT_STYLE.background};
    border: ${WEATHER_DOT_STYLE.border};
    box-shadow: ${WEATHER_DOT_STYLE.boxShadow};
  "></div>`,
  className: "bg-transparent border-none",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
});

function formatCurrent(reading?: WeatherReading | null) {
  if (!reading) return "No current reading";

  const parts = [
    reading.tempC != null ? `Temperature: ${reading.tempC} °C` : null,
    reading.windKmh != null ? `${reading.windKmh} km/h wind` : null,
    reading.rhPct != null ? `${reading.rhPct}% humidity` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Current reading available";
}

export default function WeatherStationsLayer({ visible }: { visible: boolean }) {
  const { getToken } = useAuth();
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [currentByLocation, setCurrentByLocation] = useState<
    Record<string, WeatherReading | null>
  >({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStations() {
      try {
        const token = await getToken();

        if (!token) {
          setError("Missing auth token");
          return;
        }
        const nextLocations = await getWeatherLocations(token);

        if (cancelled) {
          return;
        }

        setLocations(nextLocations);

        const currentResponses = await Promise.all(
          nextLocations.map(async (location) => {
            try {
              const response = await getCurrentWeather(token, location.id);
              return [location.id, response.current] as const;
            } catch {
              return [location.id, null] as const;
            }
          }),
        );

        if (!cancelled) {
          setCurrentByLocation(Object.fromEntries(currentResponses));
        }
      } catch {
        if (!cancelled) {
          setError("Could not load weather stations");
        }
      }
    }

    fetchStations();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const validLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          Number.isFinite(location.latitude) &&
          Number.isFinite(location.longitude),
      ),
    [locations],
  );

  if (error) {
    console.error(error);
  }

  return (
  <>
    {visible &&
      validLocations.map((location) => {
        const current = currentByLocation[location.id];

        return (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={weatherStationIcon}
          >
            <Popup>
              <div>
                <h3>{location.title}</h3>
                <p>
                  {location.country}, {location.id}
                </p>
                <p>{formatCurrent(current)}</p>
                <p>
                  Location: {location.latitude}, {location.longitude}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
  </>
);
}
