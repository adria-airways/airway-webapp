import { MapContainer, TileLayer } from 'react-leaflet'
import WeatherStationsLayer from './weatherStationsLayer'
import PlaneMap from './planeMap'

import {
  type Planes
} from "../lib/planeApi";

export default function MapView({
    planes, 
    tokenSnapshot,
    selectedPlane
}: { 
    planes: Planes[]; 
    tokenSnapshot: string | null;
    selectedPlane: string | null;
}){
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

                <PlaneMap
                    planes={planes}
                    tokenSnapshot={tokenSnapshot}
                    selectedPlane={selectedPlane}
                />
                <WeatherStationsLayer />
                
            </MapContainer>
        </div>
    )
}