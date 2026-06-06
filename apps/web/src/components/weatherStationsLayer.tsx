import { useEffect, useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useAuth } from "@clerk/clerk-react";
import L from "leaflet";

import weatherIcon from "../assets/weather.png";

import {
  getCurrentWeather,
  getWeatherLocations,
  type WeatherLocation,
  type WeatherReading,
} from "../lib/weatherApi";

const weatherStationIcon = L.divIcon({
  html: `<div style="
      background: white;
      border-radius: 50%;
      padding: 3px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <img src="${weatherIcon}" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>`,
  className: "bg-transparent border-none",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
});

function formatValue(value: number | null | undefined, unit: string) {
  if (value == null) {
    return "N/A";
  }

  return `${value}${unit}`;
}

function formatObservations(value: string | null | undefined) {
  if (!value) {
    return "Unknown time";
  }

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CurrentWeatherDetails({
  reading,
}: {
  reading?: WeatherReading | null;
}) {
  if (!reading) {
    return (
      <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
        No current weather reading available.
      </div>
    );
  }

  return (
    <div className="mt-3 min-w-56 space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase text-gray-500">
            Temperature
          </div>
          <div className="text-3xl font-semibold text-gray-900">
            {formatValue(reading.tempC, "°C")}
          </div>
        </div>

        {reading.iconCode && (
          <div className="rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
            {reading.iconCode}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Wind</div>
          <div className="font-medium text-gray-900">
            {formatValue(reading.windKmh, " km/h")}
          </div>
          {reading.windDir && (
            <div className="text-xs text-gray-500">{reading.windDir}</div>
          )}
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Gusts</div>
          <div className="font-medium text-gray-900">
            {formatValue(reading.gustKmh, " km/h")}
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Humidity</div>
          <div className="font-medium text-gray-900">
            {formatValue(reading.rhPct, "%")}
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Pressure</div>
          <div className="font-medium text-gray-900">
            {formatValue(reading.mslHpa, " hPa")}
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Precipitation</div>
          <div className="font-medium text-gray-900">
            {formatValue(reading.precipMm, " mm")}
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Observed</div>
          <div className="font-medium text-gray-900">
            {formatObservations(reading.validAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeatherStationsLayer({
  visible,
}: {
  visible: boolean;
}) {
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
              pane={"weatherPane"}
              icon={weatherStationIcon}
            >
              <Popup>
                <div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {location.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {location.country}, {location.id}
                    </p>
                  </div>

                  <CurrentWeatherDetails reading={current} />

                  <p className="mt-3 text-xs text-gray-400">
                    Location: {location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
}
