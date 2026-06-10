import type { Snapshot } from "../lib/planeApi";

interface SnapshotTimelineProps {
  snapshots: Snapshot[];
  sliderIndex: number;
  mode: "live" | "history";
  loading: boolean;
  onChangeIndex: (index: number) => void;
  onReturnLive: () => void;
}

export default function SnapshotTimeline({
  snapshots,
  sliderIndex,
  mode,
  loading,
  onChangeIndex,
  onReturnLive,
}: SnapshotTimelineProps) {
  const selectedSnapshot = snapshots[sliderIndex] ?? null;

  return (
    <div className="absolute bottom-16 left-1/2 z-[1000] w-[calc(100vw-2rem)] max-w-[520px] -translate-x-1/2 bg-white/95 border border-gray-200 shadow-lg rounded-lg px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900">
            {mode === "live" ? "Live planes" : "Plane history"}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {selectedSnapshot
              ? `${new Date(selectedSnapshot.snapshotTime).toLocaleString()} - ${selectedSnapshot.aircraftCount} planes`
              : "No snapshots available"}
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnLive}
          disabled={mode === "live"}
          className="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        >
          Live
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-gray-500">Oldest</span>

        <input
          type="range"
          min={0}
          max={Math.max(snapshots.length - 1, 0)}
          value={sliderIndex}
          disabled={snapshots.length === 0}
          onChange={(event) => onChangeIndex(Number(event.target.value))}
          className="w-full accent-blue-600"
        />

        <span className="text-xs text-gray-500">Newest</span>
      </div>

      {loading && (
        <div className="mt-2 text-xs text-blue-600">Loading snapshot...</div>
      )}
    </div>
  );
}
