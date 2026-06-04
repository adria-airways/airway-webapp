import { useEffect, useState } from "react";
import "../global.css";

import {
    getPlaneRouteInfo,
    type Planes,
    type PlaneRoute
} from "../lib/planeApi"

interface SidebarCardProps {
    plane: Planes;
    token: string | null;
    isSelected: boolean;
    onClick: () => void;
}

function SidebarCard({plane, token, isSelected, onClick}: SidebarCardProps){
    const [route, setRoute] = useState<PlaneRoute | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const normalizedCallsign = plane.callsign?.toUpperCase().trim();

        if(!token || !normalizedCallsign || normalizedCallsign == "Unknown") return;

        setLoading(true);
        getPlaneRouteInfo(token, plane.hex, plane.callsign).then(res => {
            const data = Array.isArray(res) ? res[0] : res;
            setRoute(data);
        })
        .catch((err) => console.error("Error fetching card route:", err))
        .finally(() => setLoading(false));
    }, [plane.hex, plane.callsign, token]);

    return (
        <div onClick={onClick} className={`border p-3 cursor-pointer rounded-lg transition-all duration-150 ${isSelected ? "bg-blue-50/80 border-blue-400 shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
            <div>
                <div className="font-bold">{plane.callsign}</div>
                <div>{loading ? (<span className="text-xs font-medium text-blue-400 mt-1 min-h-4">Loading airline...</span>) : (route?.airline || "Private / Unknown")}</div>
            </div>
        </div>
    )
}

export default function Sidebar({planes, tokenSnapshot, selectedPlane, onSelect}: { planes: Planes[]; tokenSnapshot: string | null; selectedPlane: string | null; onSelect: (id: string) => void; }){
    return(
        <div className="w-sm bg-white p-4 border-r-gray-300 overflow-y-auto flex flex-col">
            <h2 className="mb-4 font-bold">Plane List</h2>
            <div className="flex flex-col gap-2">
                {planes.map((plane) => (
                    <SidebarCard key={plane.hex} plane={plane} token={tokenSnapshot} isSelected={plane.hex === selectedPlane} onClick={() => onSelect(plane.hex)}/>
                ))}
            </div>
        </div>
    )
}