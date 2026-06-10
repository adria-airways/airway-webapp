import { MapContainer, TileLayer } from "react-leaflet";
import WeatherStationsLayer from "./weatherStationsLayer";
import PlaneMap from "./planeMap";
import { useEffect, useState } from "react";
import { ResetZoomButton } from "./resetZoomButton";
import { MapLegend } from "./mapLegend";
import { LayerToggle } from "./layerToggle";
import { MapStyleToggle } from "./mapStyleToggle";

import mapLayers from "../assets/mapStyle.png"

export type MapStyle = "standard" | "dark" | "topography" | "satellite";

const MAP_LAYERS: Record<MapStyle, { url: string; attribution: string }> = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },

  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO",
  },

  topography: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri",
  },
};

import { type Planes } from "../lib/planeApi";
import { useMap } from "react-leaflet";

function PaneInitializer() {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane("weatherPane")) {
      const weatherPane = map.createPane("weatherPane");
      weatherPane.style.zIndex = "450";
      weatherPane.style.pointerEvents = "none";
    }

    if (!map.getPane("planePane")) {
      const planePane = map.createPane("planePane");
      planePane.style.zIndex = "650";
    }
  }, [map]);

  return null;
}

export default function MapView({
  planes,
  tokenSnapshot,
  selectedPlane,
  weatherTime,
}: {
  planes: Planes[];
  tokenSnapshot: string | null;
  selectedPlane: string | null;
  weatherTime: string | null;
}) {
  const [showWeatherStations, setShowWeatherStations] = useState(true);
  const [showPlanes, setShowPlanes] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={[46.151, 14.835]}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
      >
        <PaneInitializer />

        <TileLayer
          attribution={MAP_LAYERS[mapStyle].attribution}
          url={MAP_LAYERS[mapStyle].url}
        />

        <WeatherStationsLayer
          visible={showWeatherStations}
          weatherTime={weatherTime}
        />
        <PlaneMap
          visible={showPlanes}
          planes={planes}
          tokenSnapshot={tokenSnapshot}
          selectedPlane={selectedPlane}
        />

        <ResetZoomButton />
      </MapContainer>

      <MapLegend />

      <div className="absolute bottom-6 right-4 z-4000 flex gap-2 items-end">
        <LayerToggle
          label="Weather"
          active={showWeatherStations}
          onChange={() => setShowWeatherStations((v) => !v)}
          activeColor="bg-sky-500"
        />

        <LayerToggle
          label="Planes"
          active={showPlanes}
          onChange={() => setShowPlanes((v) => !v)}
          activeColor="bg-yellow-300"
        />

        <div className="relative flex flex-col items-center justify-end">
          {isStyleOpen && (
            <div className="absolute bottom-full right-0 mb-3 p-1.5 rounded-lg shadow-md border bg-white border-gray-100 flex flex-col gap-1 z-4001 min-w-25">
              <MapStyleToggle active={mapStyle} setActive={setMapStyle} />
            </div>
          )}

          <button 
            onClick={() => setIsStyleOpen(!isStyleOpen)} 
            className="rounded-full bg-white p-2 cursor-pointer transition-all flex items-center justify-center shadow-md active:scale-95"
          >
            <img src={mapLayers} alt="Map Style" className="w-5 h-5 object-contain"/>
          </button>
        </div>
      </div>
    </div>
  );
}
