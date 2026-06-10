import "../global.css";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import MapView from "./mapView";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./sidebar";
import Filter from "./filter";
import SnapshotTimeline from "./snapshotTimeline";
import {
  normalizeLivePlanes,
  normalizeSnapshots,
} from "../lib/planeTransforms";

import {
  getPlaneLocations,
  getPlanesFromSnapshot,
  getSnapshots,
  type Planes,
  type PlaneRoute,
  type Snapshot,
} from "../lib/planeApi";

import { type FilterData } from "./filter";

import closeSide from "../assets/closeSide.png";
import openSide from "../assets/openSide.png";

const SNAPSHOT_ANIMATION_FALLBACK_MS = 180000;
const SNAPSHOT_ANIMATION_TICK_MS = 100;

type LiveSnapshotAnimation = {
  from: Planes[];
  to: Planes[];
  fromTime: string;
  toTime: string;
  startedAt: number;
};

function getSnapshotAnimationDuration(fromTime: string, toTime: string) {
  const duration = new Date(toTime).getTime() - new Date(fromTime).getTime();
  return duration > 0 ? duration : SNAPSHOT_ANIMATION_FALLBACK_MS;
}

function getBearing(from: Planes, to: Planes) {
  const fromLat = (from.latitude * Math.PI) / 180;
  const toLat = (to.latitude * Math.PI) / 180;
  const deltaLon = ((to.longitude - from.longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLon) * Math.cos(toLat);
  const x =
    Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(deltaLon);

  return (Math.atan2(y, x) * 180) / Math.PI;
}

function interpolatePlanes(
  fromPlanes: Planes[],
  toPlanes: Planes[],
  progress: number,
) {
  const targetByHex = new Map(toPlanes.map((plane) => [plane.hex, plane]));

  return fromPlanes.map((plane) => {
    const target = targetByHex.get(plane.hex);

    if (!target) return plane;

    return {
      ...plane,
      latitude:
        plane.latitude + (target.latitude - plane.latitude) * progress,
      longitude:
        plane.longitude + (target.longitude - plane.longitude) * progress,
      heading: getBearing(plane, target),
      groundSpeed: target.groundSpeed,
    };
  });
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Dashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [planes, setPlane] = useState<Planes[]>([]);
  const [selectedPlane, setSelectedPlane] = useState<string | null>(null);
  const [tokenSnapshot, setTokenSnapshot] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterData>({
    callsign: "",
    airline: "",
  });
  const [routeCache, setRouteCache] = useState<Record<string, PlaneRoute>>({});
  const [mode, setMode] = useState<"live" | "history">("live");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [snapshotPlanes, setSnapshotPlanes] = useState<Planes[]>([]);
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Resolved State from Conflict Branches
  const [liveSnapshotAnimation, setLiveSnapshotAnimation] = useState<LiveSnapshotAnimation | null>(null);
  const [animationNow, setAnimationNow] = useState(() => Date.now());
  const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null);
  const [isLocationFilterActive, setIsLocationFilterActive] = useState(false);

  const snapshotPlaneCache = useRef<Record<number, Planes[]>>({});
  const maxRadiusKm = 30;

  const loadSnapshotPlanes = useCallback(
    async (token: string, snapshot: Snapshot, signal?: AbortSignal) => {
      const cachedPlanes = snapshotPlaneCache.current[snapshot.id];
      if (cachedPlanes) {
        return cachedPlanes;
      }

      const responseData = await getPlanesFromSnapshot(
        token,
        snapshot.id,
        signal,
      );
      const normalized = normalizeSnapshots(responseData);

      snapshotPlaneCache.current[snapshot.id] = normalized;
      return normalized;
    },
    [],
  );

  // Poll for Live Planes
  useEffect(() => {
    let cancelled = false;

    async function fetchPlanes() {
      try {
        const token = await getToken();
        if (!token || cancelled || mode !== "live") return;

        setTokenSnapshot(token);

        const responseData = await getPlaneLocations(token);
        const normalized = normalizeLivePlanes(responseData);

        setPlane((prev) => {
          if (!normalized.length && prev.length > 0) return prev;
          return normalized;
        });
      } catch (error) {
        console.error("Locations layer polling breakdown:", error);
      }
    }

    fetchPlanes();
    const interval = setInterval(fetchPlanes, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [getToken, mode]);

  // Load Timelines/Snapshots
  useEffect(() => {
    let cancelled = false;

    async function fetchSnapshots() {
      try {
        const token = await getToken();
        if (!token || cancelled) return;

        setTokenSnapshot(token);

        const responseData = await getSnapshots(token);
        const sortedSnapshots = [...responseData.data].sort(
          (a, b) =>
            new Date(a.snapshotTime).getTime() -
            new Date(b.snapshotTime).getTime(),
        );

        setSnapshots(sortedSnapshots);

        if (mode === "live" && sortedSnapshots.length > 0) {
          setSliderIndex(sortedSnapshots.length - 1);
        }
      } catch (error) {
        console.error("Failed loading snapshots:", error);
      }
    }

    fetchSnapshots();
    const interval = window.setInterval(fetchSnapshots, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [getToken, mode]);

  // Handle Animation Pre-loading
  useEffect(() => {
    if (mode !== "live" || !tokenSnapshot || snapshots.length < 2) return;

    const controller = new AbortController();
    const fromSnapshot = snapshots[snapshots.length - 2];
    const toSnapshot = snapshots[snapshots.length - 1];
    const token = tokenSnapshot;

    if (!fromSnapshot || !toSnapshot) return;

    async function loadLiveSnapshotAnimation() {
      try {
        const [from, to] = await Promise.all([
          loadSnapshotPlanes(token, fromSnapshot, controller.signal),
          loadSnapshotPlanes(token, toSnapshot, controller.signal),
        ]);

        setLiveSnapshotAnimation({
          from,
          to,
          fromTime: fromSnapshot.snapshotTime,
          toTime: toSnapshot.snapshotTime,
          startedAt: Date.now(),
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed loading live snapshot animation:", error);
      }
    }

    void loadLiveSnapshotAnimation();

    return () => {
      controller.abort();
    };
  }, [loadSnapshotPlanes, mode, snapshots, tokenSnapshot]);

  // Historic Playback Core
  useEffect(() => {
    if (mode !== "history") return;

    const snapshot = snapshots[sliderIndex];
    if (!snapshot || !tokenSnapshot) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSnapshotLoading(true);

      try {
        const normalized = await loadSnapshotPlanes(
          tokenSnapshot,
          snapshot,
          controller.signal,
        );

        setSnapshotPlanes(normalized);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed loading snapshot planes:", error);
        setSnapshotPlanes([]);
      } finally {
        if (!controller.signal.aborted) {
          setSnapshotLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [loadSnapshotPlanes, mode, snapshots, sliderIndex, tokenSnapshot]);

  // Historic Neighbors Prefetcher Loop
  useEffect(() => {
    if (mode !== "history" || !tokenSnapshot) return;

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      const neighborIndexes = [sliderIndex - 1, sliderIndex + 1].filter(
        (index) => index >= 0 && index < snapshots.length,
      );

      for (const index of neighborIndexes) {
        if (controller.signal.aborted) break;

        const snapshot = snapshots[index];

        if (!snapshot || snapshotPlaneCache.current[snapshot.id]) {
          continue;
        }

        await loadSnapshotPlanes(
          tokenSnapshot,
          snapshot,
          controller.signal,
        ).catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          console.error("Failed prefetching snapshot planes:", error);
        });
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [loadSnapshotPlanes, mode, snapshots, sliderIndex, tokenSnapshot]);

  // Live Interpolation Clock Tick Tracker
  useEffect(() => {
    if (mode !== "live" || !liveSnapshotAnimation) return;

    const interval = window.setInterval(() => {
      setAnimationNow(Date.now());
    }, SNAPSHOT_ANIMATION_TICK_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [liveSnapshotAnimation, mode]);

  // Geolocation Mount Handler Tracker
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (error) => {
        console.error("Error retrieving geolocation:", error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSelect = (hex: string) => {
    setSelectedPlane(hex);
  };

  const handleApplyFilters = (filters: FilterData) => {
    setActiveFilters(filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({ callsign: "", airline: "" });
  };

  const handleRouteLoaded = useCallback(
    (hex: string, routeData: PlaneRoute) => {
      setRouteCache((prev) => {
        if (prev[hex]) return prev;
        return { ...prev, [hex]: routeData };
      });
    },
    [],
  );

  const handleChangeSnapshotIndex = (index: number) => {
    setMode("history");
    setSliderIndex(index);
    setSelectedPlane(null);
  };

  const handleReturnLive = () => {
    setMode("live");
    setSelectedPlane(null);
    setSnapshotPlanes([]);

    if (snapshots.length > 0) {
      setSliderIndex(snapshots.length - 1);
    }
  };

  // Interpolated Flight Calculations
  const animatedLivePlanes = useMemo(() => {
    if (!liveSnapshotAnimation) return planes;

    const duration = getSnapshotAnimationDuration(
      liveSnapshotAnimation.fromTime,
      liveSnapshotAnimation.toTime,
    );
    const progress = Math.min(
      Math.max((animationNow - liveSnapshotAnimation.startedAt) / duration, 0),
      1,
    );

    return interpolatePlanes(
      liveSnapshotAnimation.from,
      liveSnapshotAnimation.to,
      progress,
    );
  }, [animationNow, liveSnapshotAnimation, planes]);

  // Choose Dataset Basis according to Screen state mode
  const visiblePlanes = mode === "history" ? snapshotPlanes : animatedLivePlanes;

  // Process Dataset Calculations down past location bounds thresholds
  const filteredPlanes = visiblePlanes.filter((plane) => {
    if (isLocationFilterActive && userLocation) {
      const userLat = userLocation.lat as number;
      const userLon = userLocation.lon as number;
      const planeLat = plane.latitude as number;
      const planeLon = plane.longitude as number;

      const distance = getDistanceKm(userLat, userLon, planeLat, planeLon);

      if (distance > maxRadiusKm) return false;
    }

    if (activeFilters.callsign) {
      const searchCallsign = activeFilters.callsign.toUpperCase().trim();
      if (!plane.callsign.toUpperCase().includes(searchCallsign)) return false;
    }

    if (activeFilters.airline) {
      const cachedRoute = routeCache[plane.hex];
      if (!cachedRoute || !cachedRoute.airline) return false;

      const searchAirline = activeFilters.airline.toLowerCase().trim();
      if (!cachedRoute.airline.toLowerCase().includes(searchAirline))
        return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[url(/index-bg.jpg)] bg-cover bg-center">
      <header className="w-full flex justify-between items-center bg-black/20 p-5 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            AirWay
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-white drop-shadow-md">
            {user?.firstName}
          </h1>
          <UserButton />
        </div>
      </header>

      <div className="flex flex-1 h-full min-h-0 w-full relative overflow-hidden">
        
        {isSidebarOpen && (
          <Sidebar
            planes={filteredPlanes}
            tokenSnapshot={tokenSnapshot}
            selectedPlane={selectedPlane}
            isOpen={isSidebarOpen}
            isFilterOpen={isFilterOpen}
            onSelect={handleSelect}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            onRouteLoaded={handleRouteLoaded}
            isLocationFilterActive={isLocationFilterActive}
            onToggleLocationFilter={() => setIsLocationFilterActive(!isLocationFilterActive)}
            hasLocation={!!userLocation}
          />
        )}

       <div className="flex-1 h-full min-w-0 relative overflow-hidden">
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-[45%] h-20 z-5000 bg-white text-gray-800 p-2 rounded-tr-md rounded-br-md border-t border-r border-b border-gray-300 hover:bg-gray-100 transition-all font-medium text-sm cursor-pointer"
            style={{
              left: isSidebarOpen ? "384px" : "0px",
            }}
          >
            {isSidebarOpen ? (
              <img src={closeSide} alt="Close list" className="w-6 h-6 object-contain"/>
            ) : (
              <img src={openSide} alt="Open list" className="w-6 h-6 object-contain"/>
            )}
          </button>
          
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
            weatherTime={
              mode === "history"
                ? (snapshots[sliderIndex]?.snapshotTime ?? null)
                : null
            }
          />
        </div>
      </div>

      <SnapshotTimeline
        snapshots={snapshots}
        sliderIndex={sliderIndex}
        mode={mode}
        loading={snapshotLoading}
        onChangeIndex={handleChangeSnapshotIndex}
        onReturnLive={handleReturnLive}
      />

      <footer></footer>
    </div>
  );
}