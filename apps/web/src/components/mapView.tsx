import { MapContainer, TileLayer } from 'react-leaflet'
import WeatherStationsLayer from './weatherStationsLayer'
import PlaneMap from './planeMap'
import { useState } from 'react'
import { ResetZoomButton } from './resetZoomButton'
import { MapLegend } from './mapLegend'

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

                <button
                    onClick={() => setShowWeatherStations(v => !v)}
                    className={`px-3 py-1 rounded-full text-sm transition ${showWeatherStations
                            ? "bg-sky-500 text-white"
                            : "bg-white text-gray-700"
                        }`}
                >
                    Weather
                </button>

                <button
                    onClick={() => setShowPlanes(v => !v)}
                    className={`px-3 py-1 rounded-full text-sm transition ${showPlanes
                            ? "bg-yellow-300 text-white"
                            : "bg-white text-gray-700"
                        }`}
                >
                    Planes
                </button>

            </div>
        </div>
    )
}