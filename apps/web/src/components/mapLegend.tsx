import planeIcon from "../assets/plane.png";
import { WEATHER_DOT_STYLE } from "../mapStyles";

export function MapLegend() {
  return (
    <div className="absolute bottom-1/12 left-2 z-1000 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-md text-sm space-y-2">

      <div className="flex items-center gap-2">
        <div
          style={WEATHER_DOT_STYLE}></div>
        <span>Weather stations</span>
      </div>

      <div className="flex items-center gap-2">
        <img src={planeIcon} className="w-4 h-4" alt="plane icon" />
        <span>Planes</span>
      </div>

    </div>
  );
}