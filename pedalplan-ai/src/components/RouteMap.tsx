import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { lookupCoords, geocodeNominatim, type LatLng } from "@/lib/coordinates";
import type { DayPlan } from "@/lib/itineraryGenerator";

// ─── Fix Leaflet's broken default icon paths in Vite ─────────────────────────
// (Leaflet assumes assets are at a specific URL which Vite changes)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Custom DivIcon markers ───────────────────────────────────────────────────

function makeIcon(type: "start" | "end" | "mid", label: string): L.DivIcon {
  const cfg = {
    start: { bg: "#1f6f4b", border: "#fff", size: 38, fontSize: 13 },
    end:   { bg: "#c0392b", border: "#fff", size: 38, fontSize: 13 },
    mid:   { bg: "#2c6fad", border: "#fff", size: 30, fontSize: 11 },
  }[type];

  return L.divIcon({
    html: `
      <div style="
        width:${cfg.size}px;height:${cfg.size}px;
        background:${cfg.bg};
        border:3px solid ${cfg.border};
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:700;font-size:${cfg.fontSize}px;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        font-family:system-ui,sans-serif;
        cursor:pointer;
        transition:transform .15s;
        user-select:none;
      ">${label}</div>`,
    className: "",
    iconSize: [cfg.size, cfg.size],
    iconAnchor: [cfg.size / 2, cfg.size / 2],
    popupAnchor: [0, -(cfg.size / 2 + 4)],
  });
}

// ─── Auto-fit bounds when coords are ready ────────────────────────────────────

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (points.length < 2 || fitted.current) return;
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 13 });
    fitted.current = true;
  }, [points, map]);

  return null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type MapWaypoint = {
  name: string;
  /** 1-based day this is the start of; 0 = pure destination */
  day: number;
  distance: number;
  isStart: boolean;
  isEnd: boolean;
};

type ResolvedPoint = MapWaypoint & { coords: LatLng };

// ─── Main component ────────────────────────────────────────────────────────────

interface RouteMapProps {
  days: DayPlan[];
  startLocation: string;
  destination: string;
}

export default function RouteMap({ days, startLocation, destination }: RouteMapProps) {
  const [resolved, setResolved] = useState<ResolvedPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Build the ordered waypoint list from days (deduplicated, ordered)
  const waypoints: MapWaypoint[] = (() => {
    const pts: MapWaypoint[] = [];
    days.forEach((d, i) => {
      if (i === 0) {
        pts.push({ name: d.startTown, day: 1, distance: d.distance, isStart: true, isEnd: false });
      }
      const isEnd = i === days.length - 1;
      pts.push({ name: d.endTown, day: d.day + 1, distance: isEnd ? 0 : days[i + 1]?.distance ?? 0, isStart: false, isEnd });
    });
    // Deduplicate consecutive identical names
    return pts.filter((p, i) => i === 0 || p.name !== pts[i - 1].name);
  })();

  useEffect(() => {
    let cancelled = false;

    async function resolveAll() {
      setLoading(true);

      // ── Debug: log what RouteMap received ──────────────────────────────────
      console.log(
        `[RouteMap] destination="${destination}" startLocation="${startLocation}" waypoints=${waypoints.length}`,
      );
      waypoints.forEach((wp, i) =>
        console.log(
          `[RouteMap]   [${i}] name="${wp.name}" isStart=${wp.isStart} isEnd=${wp.isEnd}`,
        ),
      );

      // ── Resolution pass: static table only ────────────────────────────────
      // Nominatim is intentionally NOT used. Nominatim returns wrong-country
      // results for ambiguous names (e.g. "Kampala" also exists in Australia).
      // Any name absent from the table is a synthetic placeholder ("Roadside
      // Camp" etc.) and is silently skipped — it must not appear on the map.
      const result: ResolvedPoint[] = [];

      for (let i = 0; i < waypoints.length; i++) {
        const wp = waypoints[i];
        const coords = lookupCoords(wp.name);
        if (coords) {
          console.log(
            `[RouteMap]   ✓ TABLE HIT  "${wp.name}" → [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`,
          );
          result.push({ ...wp, coords });
        } else {
          // Warn but do NOT call Nominatim — wrong geocoding is worse than a
          // missing marker. If this fires for a real city, add it to coordinates.ts.
          console.warn(
            `[RouteMap]   ✗ TABLE MISS "${wp.name}" — skipping (Nominatim disabled)`,
          );
        }
      }

      console.log(`[RouteMap] resolved ${result.length}/${waypoints.length} waypoints from table`);

      if (!cancelled) {
        setResolved(result);
        setLoading(false);
      }
    }

    resolveAll();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLocation, destination, days.length]);

  const polylinePoints = resolved.map((p) => p.coords);
  const centre: LatLng = resolved.length > 0
    ? resolved[Math.floor(resolved.length / 2)].coords
    : [-1.5, 35.0]; // fallback to East Africa centre

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-border shadow-sm bg-card">
      {/* Map header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#1f6f4b]" />
          <span className="text-sm font-semibold text-foreground">
            {startLocation}
          </span>
          <span className="text-muted-foreground text-sm">→</span>
          <div className="w-2 h-2 rounded-full bg-[#c0392b]" />
          <span className="text-sm font-semibold text-foreground">
            {destination}
          </span>
        </div>
        {loading && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Resolving locations…
          </span>
        )}
        {!loading && (
          <span className="text-xs text-muted-foreground">
            {resolved.length} waypoints · OpenStreetMap
          </span>
        )}
      </div>

      {/* Map */}
      <div className="relative" style={{ height: "420px" }}>
        <MapContainer
          center={centre}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Route polyline */}
          {polylinePoints.length >= 2 && (
            <Polyline
              positions={polylinePoints}
              pathOptions={{
                color: "#1f6f4b",
                weight: 4,
                opacity: 0.8,
                dashArray: "1, 0",
              }}
            />
          )}

          {/* Markers */}
          {resolved.map((pt, i) => {
            const type = pt.isStart ? "start" : pt.isEnd ? "end" : "mid";
            const label = pt.isStart ? "S" : pt.isEnd ? "E" : String(pt.day - 1);
            const icon = makeIcon(type, label);

            return (
              <Marker key={`${pt.name}-${i}`} position={pt.coords} icon={icon}>
                <Popup
                  className="pedalplan-popup"
                  closeButton={false}
                  offset={[0, -6]}
                >
                  <div style={{
                    fontFamily: "system-ui, sans-serif",
                    minWidth: 160,
                    padding: "2px 0",
                  }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#1a1a1a",
                      marginBottom: 6,
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: 6,
                    }}>
                      {pt.name}
                    </div>
                    {pt.isStart && (
                      <div style={{ color: "#1f6f4b", fontWeight: 600, fontSize: 12 }}>
                        🚴 Start
                      </div>
                    )}
                    {pt.isEnd && (
                      <div style={{ color: "#c0392b", fontWeight: 600, fontSize: 12 }}>
                        🏁 Destination
                      </div>
                    )}
                    {!pt.isStart && !pt.isEnd && (
                      <>
                        <div style={{ color: "#555", fontSize: 12, marginBottom: 2 }}>
                          <span style={{ fontWeight: 600 }}>Day {pt.day - 1}</span> end of stage
                        </div>
                        {days[pt.day - 2] && (
                          <div style={{ color: "#888", fontSize: 11 }}>
                            Stage distance: {days[pt.day - 2].distance} km
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Auto-fit to all resolved points */}
          {polylinePoints.length >= 2 && <FitBounds points={polylinePoints} />}
        </MapContainer>

        {/* Loading overlay */}
        {loading && resolved.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60 backdrop-blur-sm z-[1000]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-foreground">Loading map…</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-border bg-muted/30 flex flex-wrap gap-x-6 gap-y-2">
        {[
          { color: "#1f6f4b", label: "Start" },
          { color: "#2c6fad", label: "Waypoint" },
          { color: "#c0392b", label: "Destination" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ background: color }}
            />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
          <div className="w-6 border-t-2 border-dashed" style={{ borderColor: "#1f6f4b" }} />
          Route
        </div>
        <p className="w-full text-[10px] text-muted-foreground/60 mt-0.5">
          Click any marker to see town details. Scroll to zoom disabled — use the + / − controls.
        </p>
      </div>
    </div>
  );
}
