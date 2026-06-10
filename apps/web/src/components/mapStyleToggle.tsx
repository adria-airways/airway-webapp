import type { MapStyle } from "./mapView";

type MapStyleToggleProps = {
  active: MapStyle;
  setActive: (style: MapStyle) => void;
};

export function MapStyleToggle({
  active,
  setActive,
}: MapStyleToggleProps) {
  const options: MapStyle[] = ["standard", "dark", "topography", "satellite"];

  return (
    <>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setActive(opt)}
          className={`px-2 py-1 rounded text-sm ${
            active === opt ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200"
          } `}
        >
          {opt}
        </button>
      ))}
    </>
  );
}
