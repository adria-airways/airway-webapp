import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useAuth } from "@clerk/clerk-react";

import "../global.css";
import planeIcon from "../assets/plane.png";

import {
  getPlaneLocations,
  getPlaneRouteInfo,
  type Planes,
  type PlaneRoute
} from "../lib/planeApi";

function LivePlaneMarker({ plane, token }: { plane: Planes; token: string }) {
  const { hex, longitude, latitude, callsign, heading, origin_country } = plane;
  const [route, setRoute] = useState<PlaneRoute | null>(null);
  const [loading, setLoading] = useState(false);

  const angle = heading ?? 0;

  const dynamicIcon = L.divIcon({
    html: `<div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <img src="${planeIcon}"
        style="
          transform: rotate(${angle}deg);
          width: 32px; height: 32px;
          display: block;
          filter: drop-shadow(1px 0 0 black)
                  drop-shadow(-1px 0 0 black)
                  drop-shadow(0 1px 0 black)
                  drop-shadow(0 -1px 0 black);
        " />
    </div>`,
    className: "bg-transparent border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  const fetchRouteDetails = async () => {
    if (route || loading || !callsign) return;

    setLoading(true);
    try {
      const responseData = await getPlaneRouteInfo(token, hex, callsign);

      const cleanRoute =
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
          ? (responseData as any).data
          : responseData;

      setRoute(cleanRoute);
    } catch (err) {
      console.error(`Failed loading route records for ${callsign}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Marker
      position={[latitude, longitude]}
      icon={dynamicIcon}
      eventHandlers={{ popupopen: fetchRouteDetails }}
    >
      <Popup>
        <div>
          <h3>{callsign || "Unknown Callsign"}</h3>

          {loading && (
            <p className="text-xs text-gray-500 animate-pulse">
              Loading route data...
            </p>
          )}

          {!loading && route ? (
            <p className="text-blue-600 font-medium my-1">
              {route.flying_from_country || route.flying_from_city || "Unknown"} →
              {route.flying_to_country || route.flying_to_city || "Unknown"}
            </p>
          ) : (
            !loading && (
              <p className="text-xs text-gray-400 italic my-1">
                No route filed
              </p>
            )
          )}

          <p>Origin: {origin_country || "Not Specified"}</p>
          <p>
            Pos: {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

// MAIN COMPONENT
export default function PlaneMap() {
  const { getToken } = useAuth();
  const [planes, setPlanes] = useState<Planes[]>([]);
  const [tokenSnapshot, setTokenSnapshot] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlanes() {
      try {
        const token = await getToken();
        if (!token || cancelled) return;

        setTokenSnapshot(token);

        const responseData = await getPlaneLocations(token);

        let planeArray: any[] = [];

        if (responseData?.data && Array.isArray(responseData.data)) {
          planeArray = responseData.data;
        } else if (Array.isArray(responseData)) {
          planeArray = responseData;
        }

        const normalized: Planes[] = planeArray.map((p: any) => ({
          hex: p.plane_live.hex,
          callsign: p.plane_live.callsign ?? "UNKNOWN",
          latitude: Number(p.plane_live.latitude ?? p.plane_live?.latitude),
          longitude: Number(p.plane_live.longitude ?? p.plane_live?.longitude),
          origin_country: p.plane_live.origin_country ?? p.plane_live?.origin_country ?? "Unknown",
          heading: Number(p.plane_live.heading ?? p.plane_live?.heading ?? 0),
          ground_speed: Number(p.plane_live.ground_speed ?? p.plane_live?.ground_speed ?? 0),
        }));

        setPlanes((prev) => {
          if (!normalized.length && prev.length > 0) return prev;
          return normalized;
        });
      } catch (error) {
        console.error("Locations layer polling breakdown:", error);
      }
    }

    fetchPlanes();
    const interval = setInterval(fetchPlanes, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [getToken]);

  const validPlanes = useMemo(() => {
    const filtered = planes.filter((plane) => {
      const lat = Number(plane.latitude);
      const lon = Number(plane.longitude);

      return Number.isFinite(lat) && Number.isFinite(lon);
    });

    console.log("RAW PLANES:", planes.length);
    console.log("VALID PLANES:", filtered.length);

    return filtered;
  }, [planes]);

  return (
    <>
      {tokenSnapshot &&
        validPlanes.map((plane) => (
          <LivePlaneMarker
            key={plane.hex ?? `${plane.latitude}-${plane.longitude}`}
            plane={plane}
            token={tokenSnapshot}
          />
        ))}
    </>
  );
}