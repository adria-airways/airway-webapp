import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import "../global.css";
import planeIcon from "../assets/plane.png";

import {
  getPlaneRouteInfo,
  type Planes,
  type PlaneRoute
} from "../lib/planeApi";
import { useMap } from "react-leaflet";


// Marker
function LivePlaneMarker({ plane, token }: { plane: Planes; token: string }) {
  const { hex, longitude, latitude, callsign, heading, originCountry } = plane;
  const [route, setRoute] = useState<PlaneRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const displayRoute = route ?? plane;

  const angle = heading ?? 0;

  const dynamicIcon = useMemo(
    () =>
      L.divIcon({
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
        className: "airway-plane-marker bg-transparent border-none",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      }),
    [angle],
  );

  const fetchRouteDetails = async () => {
    if (route || plane.airline || loading || !callsign) return;

    setLoading(true);
    try {
        const responseData = await getPlaneRouteInfo(token, hex, callsign);

        const rawData = responseData && typeof responseData === "object" && "data" in responseData
            ? (responseData as any).data
            : responseData;

        const cleanRoute = Array.isArray(rawData) ? rawData[0] : rawData;

        setRoute(cleanRoute);
    }   catch (err) {
      console.error(`Failed loading route records for ${callsign}:`, err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Marker
      position={[latitude, longitude]}
      icon={dynamicIcon}
      pane={"planePane"}
      eventHandlers={{ popupopen: fetchRouteDetails }}
    >
      <Popup>
        <div>
          <h3 className="text-center">{callsign || "Unknown Callsign"}</h3>

          {loading && (
            <p className="text-xs text-gray-500 animate-pulse">
              Loading route data...
            </p>
          )}

          {!loading && displayRoute.airline ? (
            <div>
                {!loading && displayRoute.airline ? (
                    <div>
                        <p className="text-center">{displayRoute.airline || "Unknown Airline"}</p>
                    </div>
                ) : null}
                
                <div className="text-center">
                    <p className="text-blue-600 font-medium">
                      {displayRoute.flyingFromCountry || "Unknown"}, {displayRoute.flyingFromCity || "Unknown"}
                    </p>
                    <p className="m-2">↓</p>
                    <p className="text-blue-600 font-medium">
                      {displayRoute.flyingToCountry || "Unknown"}, {displayRoute.flyingToCity || "Unknown"}
                    </p>
                </div>
            </div>
          ) : (
            !loading && (
              <p className="text-xs text-gray-400 italic my-1">
                No route filed
              </p>
            )
          )}

          <p>Origin: {originCountry || "Not Specified"}</p>
          <p>
            Pos: {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

// Main
export default function PlaneMap({
    visible,
    planes, 
    tokenSnapshot,
    selectedPlane
}: {
    visible: boolean;
    planes: Planes[]; 
    tokenSnapshot: string | null;
    selectedPlane: string | null;
}) {
    const map = useMap();
    
    // Prevent re-zooming
    const lastFlownTo = useRef<string | null>(null);

    useEffect(() => {
        map.invalidateSize();

        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => clearTimeout(timer);
    }, [planes, map]);

    // Pan to selected plane
    useEffect(() => {
        if(!selectedPlane){
            lastFlownTo.current = null;
            return;
        }

        if(selectedPlane === lastFlownTo.current){
            return;
        }

        const targetPlane = planes.find((p) => p.hex === selectedPlane);

        if(targetPlane){
            map.flyTo([targetPlane.latitude, targetPlane.longitude], 12, {
                duration: 1.5,
                easeLinearity: 0.25
            });

            lastFlownTo.current = selectedPlane;
        }
    }, [selectedPlane, planes, map])

    const validPlanes = useMemo(() => {
        const filtered = planes.filter((plane) => {
            const lat = Number(plane.latitude);
            const lon = Number(plane.longitude);

            return Number.isFinite(lat) && Number.isFinite(lon);
        });

        return filtered;
    }, [planes]);

    return (
        <>
        {visible && tokenSnapshot &&
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
