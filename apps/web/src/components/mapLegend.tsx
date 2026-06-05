import planeIcon from "../assets/plane.png";
import weatherIcon from "../assets/weather.png"

export function MapLegend() {
  return (
    <div className="absolute bottom-20 right-4 z-1000 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-md text-sm space-y-2">

      <div className="flex items-center gap-2">
        <div className="w-4.5 h-4.5 bg-white border border-gray-200 shadow-xs rounded-full flex items-center justify-center p-0.5">
          <img src={weatherIcon} className="w-full h-full object-contain" alt="Weather"/>
        </div>
        <span>Weather stations</span>
      </div>

      <div className="flex items-center gap-2">
        <img 
          src={planeIcon} 
          className="w-4 h-4" 
          style={{
            filter: `
            drop-shadow(0.5px 0 0 black) 
            drop-shadow(-0.5px 0 0 black) 
            drop-shadow(0 0.5px 0 black) 
            drop-shadow(0 -0.5px 0 black)
          `}} 
          alt="plane icon" />
        <span>Planes</span>
      </div>

    </div>
  );
}