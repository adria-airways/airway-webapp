import { useMap } from "react-leaflet";

export function ResetZoomButton() {
  const map = useMap();

  const resetView = () => {
    map.setView([46.151, 14.835], 9, {
      animate: true,
    });
  };

  return (
    <div className="absolute top-20 left-3 z-[1000]">
      <button
        onClick={resetView}
        className="bg-white px-3 py-1 rounded shadow text-sm font-medium hover:bg-gray-100"
      >
        Reset view
      </button>
    </div>
  );
}