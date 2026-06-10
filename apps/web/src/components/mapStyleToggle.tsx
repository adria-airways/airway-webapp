import { useState } from "react";
import type { MapStyle } from "./mapView";

type MapStyleToggleProps = {
  active: MapStyle;
  setActive: (style: MapStyle) => void;
};

export function MapStyleToggle({
  active,
  setActive,
}: MapStyleToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options: MapStyle[] = ["standard", "dark", "topography", "satellite"];

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-md bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setActive(opt);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm capitalize ${
                active === opt
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-full bg-white px-3 py-1 text-sm capitalize text-gray-700 shadow hover:bg-gray-100"
      >
        {active}
      </button>
    </div>
  );
}
