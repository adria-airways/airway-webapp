import "../global.css"
import { useAuth, UserButton, useUser } from "@clerk/clerk-react"
import MapView from "./mapView";
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Filter from "./filter";

import {
  getPlaneLocations,
  type Planes,
  type PlaneRoute
} from "../lib/planeApi";

import {
    type FilterData
} from "./filter"

export default function Dashboard(){
    const { getToken } = useAuth();
    const { user } = useUser();
    const [planes, setPlane] = useState<Planes[]>([]);
    const [selectedPlane, setSelectedPlane] = useState<string | null>(null);
    const [tokenSnapshot, setTokenSnapshot] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterData>({
        callsign: "",
        airline: ""
    });
    const [routeCache, setRouteCache] = useState<Record<string, PlaneRoute>>({});

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
                originCountry: p.plane_live.originCountry ?? p.plane_live?.originCountry ?? "Unknown",
                heading: Number(p.plane_live.heading ?? p.plane_live?.heading ?? 0),
                groundSpeed: Number(p.plane_live.groundSpeed ?? p.plane_live?.groundSpeed ?? 0),
            }));

            setPlane((prev) => {
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

    const handleSelect = (hex: string) => {
        const plane = planes.find((p) => p.hex == hex);
        if(plane){
            setSelectedPlane(plane.hex)
        }
    }

    const handleApplyFilters = (filters: FilterData) => {
        setActiveFilters(filters);
    }

    const handleResetFilters = () => {
        setActiveFilters({ callsign: "", airline: ""});
    }

    const handleRouteLoaded = useCallback((hex: string, routeData: PlaneRoute) => {
        setRouteCache((prev) => {
            if(prev[hex]) return prev;
            return { ...prev, [hex]: routeData };
        });
    }, []);

    const filteredPlanes = planes.filter((plane) => {
        if(activeFilters.callsign){
            const searchCallsign = activeFilters.callsign.toUpperCase().trim();
            if(!plane.callsign.toUpperCase().includes(searchCallsign)) return false;
        }

        if(activeFilters.airline){
            const cachedRoute = routeCache[plane.hex];
            if(!cachedRoute || !cachedRoute.airline) return false;

            const searchAirline = activeFilters.airline.toLowerCase().trim();
            if(!cachedRoute.airline.toLowerCase().includes(searchAirline)) return false;
        }
        return true;
    });

    return(
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[url(/index-bg.jpg)] bg-cover bg-center">
            <header className="w-full flex justify-between items-center bg-black/20 p-5 shadow-md">
                <div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-md">AirWay</h1>
                </div>
                <div className="flex items-center gap-3">
                    <h1 className="text-base font-bold text-white drop-shadow-md">{user?.firstName}</h1>
                    <UserButton/>
                </div>
            </header>

            <div className="flex h-full">
                <Sidebar 
                    planes={filteredPlanes} 
                    tokenSnapshot={tokenSnapshot} 
                    selectedPlane={selectedPlane} 
                    isFilterOpen={isFilterOpen}
                    onSelect={handleSelect} 
                    onToggleFilter = {() => setIsFilterOpen(!isFilterOpen)}
                    onRouteLoaded={handleRouteLoaded}
                />
                <Filter 
                    isOpen={isFilterOpen} 
                    onClose={() => setIsFilterOpen(false)}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                />
                <MapView 
                    planes={filteredPlanes} 
                    tokenSnapshot={tokenSnapshot}
                    selectedPlane={selectedPlane}
                />
            </div>
            <footer></footer>
        </div>
    );
};