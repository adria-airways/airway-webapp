import { useEffect, useState } from "react";
import "../global.css";

import filterIcon from "../assets/filter.png"

import {
    getPlaneRouteInfo,
    type Planes,
    type PlaneRoute
} from "../lib/planeApi"

interface SidebarProps {
    planes: Planes[];
    tokenSnapshot: string | null;
    selectedPlane: string | null;
    isFilterOpen: boolean;
    onSelect: (id: string) => void;
    onToggleFilter: () => void;
    onRouteLoaded: (hex: string, routeData: PlaneRoute) => void;
}

interface SidebarCardProps {
    plane: Planes;
    token: string | null;
    isSelected: boolean;
    onClick: () => void;
    onRouteLoaded: (hex: string, routeData: PlaneRoute) => void;
}

function SidebarCard({plane, token, isSelected, onClick, onRouteLoaded}: SidebarCardProps){
    const [route, setRoute] = useState<PlaneRoute | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        let cancelled = false;
        const normalizedCallsign = plane.callsign?.toUpperCase().trim();

        if (route || loading) return;

        if(!token || !normalizedCallsign || normalizedCallsign === "UNKNOWN") return;

        const routeToken = token;

        async function loadRoute() {
            setLoading(true);

            try {
                const res = await getPlaneRouteInfo(
                    routeToken,
                    plane.hex,
                    plane.callsign,
                ) as unknown;
                const rawData: unknown = res && typeof res === "object" && "data" in res
                    ? (res as { data?: unknown }).data
                    : res;

                const cleanRoute = (Array.isArray(rawData) ? rawData[0] : rawData) as PlaneRoute | undefined;

                if (cancelled || !cleanRoute) return;

                setRoute(cleanRoute);
                onRouteLoaded(plane.hex, cleanRoute);
            } catch (err) {
                console.error("Error fetching card route:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadRoute();

        return () => {
            cancelled = true;
        };
    }, [plane.hex, plane.callsign, token, onRouteLoaded, route, loading]);

    return (
        <div onClick={onClick} className={`border p-3 cursor-pointer rounded-lg transition-all duration-150 ${isSelected ? "bg-blue-50/80 border-blue-400 shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
            <div>
                <div className="font-bold">{plane.callsign}</div>
                <div>{loading ? (<span className="text-xs font-medium text-blue-400 mt-1 min-h-4">Loading airline...</span>) : (route?.airline || "Private / Unknown")}</div>
            </div>
        </div>
    )
}

export default function Sidebar({
    planes, 
    tokenSnapshot, 
    selectedPlane, 
    isFilterOpen,
    onSelect, 
    onToggleFilter,
    onRouteLoaded
}: SidebarProps){
    return(
        <div className="flex flex-col bg-white border-r-gray-300 w-sm">
            <div className="flex flex-row justify-between px-4 pt-4">
                <h2 className="mb-4 font-bold">Plane List</h2>
                <button type="button" onClick={onToggleFilter} className={`mb-4 cursor-pointer border-2 rounded-lg ${isFilterOpen ? "border-blue-400" : "border-gray-300"}`}>
                    <img src={`${filterIcon}`}/>
                </button>
            </div>
            <div className="bg-white border-r-gray-300 overflow-y-auto flex flex-col">
                <div className="flex flex-col gap-2">
                    {planes.map((plane) => (
                        <SidebarCard 
                            key={plane.hex} 
                            plane={plane} 
                            token={tokenSnapshot} 
                            isSelected={plane.hex === selectedPlane} 
                            onClick={() => onSelect(plane.hex)}
                            onRouteLoaded={onRouteLoaded}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
