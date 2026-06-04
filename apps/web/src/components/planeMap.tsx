import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import WeatherStationsLayer from "./weatherStationsLayer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "../global.css";
import planeIcon from "../assets/plane.png";

interface Planes {
  hex: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude?: string;
  origin_country: string;
  heading: number;
  ground_speed: number;
}

interface PlaneRoute {
  hex: string;
  callsign: string;
  airling: string;
  flying_from_city: string;
  flying_from_country: string;
  flying_to_city: string;
  flying_to_country: string;
}

const supabase = createClient(
  "https://reutwtjvdcwwdyovspta.supabase.co",
  "sb_publishable_WvJ1FHe9Log1FocWz84BHQ_G53h3pQv",
);

export default function PlaneMap() {
  const [planes, setPlanes] = useState<Planes[]>([]);
  const [routes, setRoutes] = useState<Record<string, PlaneRoute>>({});

  useEffect(() => {
    async function fetchData() {
      const { data: liveData } = await supabase.from("plane_live").select("*");
      if (liveData) setPlanes(liveData);

      const { data: routeData } = await supabase
        .from("plane_routes")
        .select("*");
      if (routeData) {
        const routeMap = routeData.reduce(
          (acc: Record<string, PlaneRoute>, route) => {
            if (route.callsign) {
              acc[route.callsign] = route;
            }
            return acc;
          },
          {} as Record<string, PlaneRoute>,
        );

        setRoutes(routeMap);
      }
    }

    fetchData();

    const liveChannel = supabase
      .channel("live-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plane_live",
        },
        () => fetchData(),
      )
      .subscribe();

    const routeChannel = supabase
      .channel("route-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plane_routes",
        },
        () => fetchData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(liveChannel);
      supabase.removeChannel(routeChannel);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MapContainer
        center={[46.151, 14.835]}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <WeatherStationsLayer />
        {planes.map((plane) => {
          if (!plane) return null;

          const { hex, latitude, longitude, callsign, heading, ground_speed } =
            plane;

          let matchRoute = null;
          if (callsign) {
            const cleanCallsign = callsign.trim().toUpperCase();
            matchRoute = routes[cleanCallsign];
          }

          if (!latitude || !longitude) return null;

          const angle = heading ?? 0;

          const dynamicIcon = L.divIcon({
            html: `<img src="${planeIcon}"
                            style="
                                transform: rotate(${angle}deg);
                                width: 32px; height: 32px;
                                display: block;
                                filter: drop-shadow(0.5px 0 0 black) drop-shadow(-0.5px 0 0 black) drop-shadow(0 0.5px 0 black) drop-shadow(0 -0.5px 0 black);
                            " alt="plane" />`,
            className: "bg-transparent border-none",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });

          return (
            <Marker
              key={hex}
              position={[latitude, longitude]}
              icon={dynamicIcon}
            >
              <Popup>
                <div>
                  <h3>Callsign: {callsign || "Unknown"}</h3>
                  {matchRoute ? (
                    <div>
                      <p>
                        From: {matchRoute.flying_from_city},{" "}
                        {matchRoute.flying_from_country}
                      </p>
                      <p>
                        To: {matchRoute.flying_to_city},{" "}
                        {matchRoute.flying_to_country}
                      </p>
                    </div>
                  ) : (
                    <p>Unknown route</p>
                  )}
                  <p>Speed: {ground_speed} kts</p>
                  <p>
                    Location: {latitude}, {longitude}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
