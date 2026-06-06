import { useEffect, useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useAuth } from "@clerk/clerk-react";
import L from "leaflet";

import weatherIcon from "../assets/weather.png";

import {
  getCurrentWeather,
  getCurrentWeatherForecast,
  getWeatherLocations,
  getWeatherReadingNear,
  type WeatherLocation,
  type WeatherReading,
} from "../lib/weatherApi";

function createWeatherStationIcon(reading?: WeatherReading | null) {
  const temperature = reading?.tempC != null ? `${reading.tempC}°C` : "";

  return L.divIcon({
    html: `<div style="
        min-width: ${temperature ? "48px" : "24px"};
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 9999px;
        border: 1px solid rgba(14, 165, 233, 0.35);
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
        padding: 2px 6px;
        color: #111827;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
      ">
        <img src="${weatherIcon}" style="width: 16px; height: 16px; object-fit: contain;" />
        ${
          temperature
            ? `<span style="line-height: 1;">${temperature}</span>`
            : ""
        }
      </div>`,
    className: "bg-transparent border-none",
    iconSize: temperature ? [52, 24] : [24, 24],
    iconAnchor: temperature ? [26, 12] : [12, 12],
    popupAnchor: [0, -12],
  });
}

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

function formatForecast(value: string | null | undefined) {
  if (!value) {
    return "Unknown time";
  }

  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
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

function ForecastWeatherDetails({
  forecast,
  loading,
}: {
  forecast?: WeatherReading[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="mt-3 rounded-md border border-sky-100 bg-sky-50 p-3 text-sm text-sky-700">
        Loading forecast...
      </div>
    );
  }

  if (!forecast) {
    return null;
  }

  if (forecast.length === 0) {
    return (
      <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
        No forecast available.
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="mb-2 text-xs font-medium uppercase text-gray-500">
        Forecast
      </div>

      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {forecast.slice(0, 6).map((reading) => (
          <div
            key={reading.id}
            className="grid grid-cols-[1fr_auto] gap-3 rounded-md bg-gray-50 p-2 text-sm"
          >
            <div>
              <div className="font-medium text-gray-900">
                {formatForecast(reading.validAt)}
              </div>
              <div className="text-xs text-gray-500">
                {reading.iconCode ?? "Forecast"}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {formatValue(reading.tempC, "°C")}
              </div>
              <div className="text-xs text-gray-500">
                {formatValue(reading.windKmh, " km/h")} wind
              </div>
              <div className="text-xs text-gray-500">
                {formatValue(reading.precipMm, " mm")} rain
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WeatherStationsLayer({
  visible,
  weatherTime,
}: {
  visible: boolean;
  weatherTime: string | null;
}) {
  const { getToken } = useAuth();
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [currentByLocation, setCurrentByLocation] = useState<
    Record<string, WeatherReading | null>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [forecastByLocation, setForecastByLocation] = useState<
    Record<string, WeatherReading[]>
  >({});
  const [forecastLoadingByLocation, setForecastLoadingByLocation] = useState<
    Record<string, boolean>
  >({});

  const handleLoadForecast = async (locationId: string) => {
    if (weatherTime) {
      return;
    }

    if (
      forecastByLocation[locationId] ||
      forecastLoadingByLocation[locationId]
    ) {
      return;
    }

    const token = await getToken();

    if (!token) {
      setError("Missing auth token");
      return;
    }

    setForecastLoadingByLocation((prev) => ({
      ...prev,
      [locationId]: true,
    }));

    try {
      const response = await getCurrentWeatherForecast(token, locationId);

      setForecastByLocation((prev) => ({
        ...prev,
        [locationId]: response.forecast,
      }));
    } catch {
      setForecastByLocation((prev) => ({
        ...prev,
        [locationId]: [],
      }));
    } finally {
      setForecastLoadingByLocation((prev) => ({
        ...prev,
        [locationId]: false,
      }));
    }
  };

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

        setCurrentByLocation({});
        setLocations(nextLocations);

        const currentResponses = await Promise.all(
          nextLocations.map(async (location) => {
            try {
              if (weatherTime) {
                const response = await getWeatherReadingNear(
                  token,
                  location.id,
                  weatherTime,
                );
                return [location.id, response.reading] as const;
              }

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
  }, [getToken, weatherTime]);

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
              pane="weatherPane"
              icon={createWeatherStationIcon(current)}
              eventHandlers={{
                popupopen: () => handleLoadForecast(location.id),
              }}
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
                  <ForecastWeatherDetails
                    forecast={forecastByLocation[location.id]}
                    loading={forecastLoadingByLocation[location.id] ?? false}
                  />

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
