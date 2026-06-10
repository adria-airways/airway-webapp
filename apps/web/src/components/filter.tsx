import { useState } from "react";
import "../global.css";

interface FilterProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterData) => void;
    onResetFilters: () => void;
}

export interface FilterData {
    callsign: string;
    airline: string;
}

export default function Filter({ isOpen, onClose, onApplyFilters, onResetFilters }: FilterProps){
    const [localFilters, setLocalFilters] = useState<FilterData>({
        callsign: "",
        airline: ""
    });

    if(!isOpen) return null;

    const handleInputChange = (field: keyof FilterData, value: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onApplyFilters(localFilters);
    };

    const handleReset = () => {
        const cleared = { callsign: "", airline: "" };
        setLocalFilters(cleared);
        onResetFilters();
    };

    return(
        <div className="absolute left-4 top-20 z-[1300] h-80 w-[calc(100vw-2rem)] max-w-72 bg-white border border-gray-200 p-4 shadow-lg transition-all animate-in slide-in-from-left-4 duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Filter Planes</h3>
                <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">
                    Close
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600 tracking-wider">
                            Callsign
                        </label>

                        <input 
                            type="text" 
                            placeholder="Callsign" 
                            value={localFilters.callsign} 
                            onChange={(e) => handleInputChange("callsign", e.target.value)}
                            className="w-full border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:border-blue-500 bg-gray-50/50"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-600 tracking-wider">
                            Airline
                        </label>
                        
                        <input 
                            type="text"
                            placeholder="Airline"
                            value={localFilters.airline}
                            onChange={(e) => handleInputChange("airline", e.target.value)}
                            className="w-full border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:border-blue-500 bg-gray-50/50"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm cursor-pointer transition-colors">
                        Apply
                    </button>
                    <button type="submit" onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm cursor-pointer transition-colors">
                        Clear
                    </button>
                </div>
            </form>
        </div>
    )
}
