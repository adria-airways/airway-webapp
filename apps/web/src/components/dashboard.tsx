import "../global.css";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import MapView from "./mapView";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const snapshotPlaneCache = useRef<Record<number, Planes[]>>({});

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

        if (sortedSnapshots.length > 0) {
          setSliderIndex(sortedSnapshots.length - 1);
        }
      } catch (error) {
        console.error("Failed loading snapshots:", error);
      }
    }

    fetchSnapshots();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

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
        setSnapshotLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [loadSnapshotPlanes, mode, snapshots, sliderIndex, tokenSnapshot]);

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

        await loadSnapshotPlanes(tokenSnapshot, snapshot, controller.signal).catch(
          (error) => {
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }

            console.error("Failed prefetching snapshot planes:", error);
          },
        );
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [loadSnapshotPlanes, mode, snapshots, sliderIndex, tokenSnapshot]);

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

  const visiblePlanes = mode === "history" ? snapshotPlanes : planes;

  const filteredPlanes = visiblePlanes.filter((plane) => {
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

      <div className="flex h-full">
        <Sidebar
          planes={filteredPlanes}
          tokenSnapshot={tokenSnapshot}
          selectedPlane={selectedPlane}
          isFilterOpen={isFilterOpen}
          onSelect={handleSelect}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
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
          weatherTime={
            mode === "history"
              ? (snapshots[sliderIndex]?.snapshotTime ?? null)
              : null
          }
        />
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
