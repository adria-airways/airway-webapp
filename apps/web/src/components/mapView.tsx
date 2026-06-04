import { MapContainer, TileLayer } from 'react-leaflet'
import WeatherStationsLayer from './weatherStationsLayer'
import PlaneMap from './planeMap'

export default function MapView(){
    return(
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
                <PlaneMap />
                
            </MapContainer>
        </div>
    )
}