import { MapContainer, TileLayer } from 'react-leaflet'
import WeatherStationsLayer from './weatherStationsLayer'
import PlaneMap from './planeMap'
import { useState } from 'react'
import { ResetZoomButton } from './resetZoomButton'
import { MapLegend } from './mapLegend'
import { LayerToggle } from "./layerToggle";

export default function MapView() {

    const [showWeatherStations, setShowWeatherStations] = useState(true)
    const [showPlanes, setShowPlanes] = useState(true)

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

                <WeatherStationsLayer visible={showWeatherStations} />
                <PlaneMap visible={showPlanes} />

                <ResetZoomButton />
                <MapLegend />

            </MapContainer>

            <div className="absolute bottom-6 right-4 z-[1000] flex gap-2">

                <LayerToggle
                    label="Weather"
                    active={showWeatherStations}
                    onChange={() => setShowWeatherStations(v => !v)}
                    activeColor="bg-sky-500"
                />

                <LayerToggle
                    label="Planes"
                    active={showPlanes}
                    onChange={() => setShowPlanes(v => !v)}
                    activeColor="bg-yellow-300"
                />

            </div>
        </div>
    )
}