import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  MapPin,
  Navigation,
  Gauge,
  Users,
  X,
  Maximize2,
  Minimize2,
  Layers,
  Radio,
  Locate,
} from 'lucide-react';
import type { BusWithLocation } from '../types';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Bus3DMapProps {
  buses: BusWithLocation[];
  userLocation?: { lat: number; lng: number } | null;
  showUserMarker?: boolean;
  className?: string;
  showLegend?: boolean;
  showInfoPanel?: boolean;
  heightClassName?: string;
}

interface SelectedBusInfo {
  id: string;
  number: string;
  routeName: string;
  status: string;
  speed: number;
  occupancy?: number;
  capacity?: number;
  driverName?: string;
  lat: number;
  lng: number;
}

/* ──────────────────────────────────────────────
   Chennai demo route for dynamic movement
   ────────────────────────────────────────────── */

const CHENNAI_CENTER: [number, number] = [80.2707, 13.0827];

const DEMO_ROUTES: [number, number][][] = [
  // Route 1 — Anna Salai corridor
  [
    [80.2707, 13.0827],
    [80.272, 13.0835],
    [80.274, 13.085],
    [80.276, 13.086],
    [80.278, 13.088],
    [80.28, 13.09],
  ],
  // Route 2 — Mount Road loop
  [
    [80.265, 13.08],
    [80.267, 13.079],
    [80.269, 13.078],
    [80.271, 13.077],
    [80.273, 13.079],
    [80.275, 13.081],
  ],
];

/* ──────────────────────────────────────────────
   Map styles
   ────────────────────────────────────────────── */

const MAP_STYLES = {
  dark: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  street: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
};

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return '#f97316';
    case 'INACTIVE':
      return '#64748b';
    case 'MAINTENANCE':
      return '#eab308';
    default:
      return '#f97316';
  }
}

/** Create a canvas-based bus marker icon */
function createBusMarkerElement(status: string, label: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'bus-marker-wrapper';
  wrapper.style.cssText = 'cursor:pointer;position:relative;';

  // Outer pulse ring
  const pulse = document.createElement('div');
  pulse.style.cssText = `
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    width:48px;height:48px;border-radius:50%;
    background:${getStatusColor(status)}20;
    animation:markerPulse 2s ease-out infinite;
  `;
  wrapper.appendChild(pulse);

  // Main icon circle
  const circle = document.createElement('div');
  circle.style.cssText = `
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg, ${getStatusColor(status)}, ${getStatusColor(status)}cc);
    border:3px solid #fff;
    box-shadow:0 4px 14px ${getStatusColor(status)}60, 0 2px 6px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    position:relative;z-index:2;
    transition:transform 0.2s ease;
  `;
  circle.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18H6a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`;
  wrapper.appendChild(circle);

  // Label below
  const labelEl = document.createElement('div');
  labelEl.style.cssText = `
    position:absolute;top:100%;left:50%;transform:translateX(-50%);
    margin-top:4px;white-space:nowrap;
    font-size:11px;font-weight:600;font-family:'Inter',sans-serif;
    color:#fff;background:rgba(0,0,0,0.75);
    padding:2px 8px;border-radius:6px;
    backdrop-filter:blur(8px);
    pointer-events:none;
  `;
  labelEl.textContent = label;
  wrapper.appendChild(labelEl);

  // Hover effect
  wrapper.addEventListener('mouseenter', () => {
    circle.style.transform = 'scale(1.15)';
  });
  wrapper.addEventListener('mouseleave', () => {
    circle.style.transform = 'scale(1)';
  });

  return wrapper;
}

function createUserMarkerElement(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'cursor:default;position:relative;';

  const pulse = document.createElement('div');
  pulse.style.cssText = `
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    width:44px;height:44px;border-radius:50%;
    background:rgba(34,197,94,0.2);
    animation:markerPulse 2s ease-out infinite;
  `;
  wrapper.appendChild(pulse);

  const dot = document.createElement('div');
  dot.style.cssText = `
    width:18px;height:18px;border-radius:50%;
    background:linear-gradient(135deg, #22c55e, #16a34a);
    border:3px solid #fff;
    box-shadow:0 2px 10px rgba(34,197,94,0.5);
    position:relative;z-index:2;
  `;
  wrapper.appendChild(dot);

  const label = document.createElement('div');
  label.style.cssText = `
    position:absolute;top:100%;left:50%;transform:translateX(-50%);
    margin-top:4px;white-space:nowrap;
    font-size:10px;font-weight:600;font-family:'Inter',sans-serif;
    color:#22c55e;background:rgba(0,0,0,0.7);
    padding:2px 6px;border-radius:4px;
    backdrop-filter:blur(8px);
  `;
  label.textContent = 'You';
  wrapper.appendChild(label);

  return wrapper;
}

/* ──────────────────────────────────────────────
   Lerp helper for smooth marker animation
   ────────────────────────────────────────────── */

function lerpCoord(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
export default function Bus3DMap({
  buses,
  userLocation = null,
  showUserMarker = true,
  className = '',
  showLegend = true,
  showInfoPanel = true,
  heightClassName = 'h-screen',
}: Bus3DMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const demoIndicesRef = useRef<Map<string, number>>(new Map());

  const [selectedBus, setSelectedBus] = useState<SelectedBusInfo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'street'>('dark');
  const [mapReady, setMapReady] = useState(false);

  /* ── Initialize MapLibre ── */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[mapStyle],
      center: CHENNAI_CENTER,
      zoom: 12,
      pitch: 45,
      bearing: -15,
      // @ts-ignore TS2353: 'antialias' might not be explicitly defined in types but it works
      antialias: true,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    map.on('load', () => {
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      userMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Handle style change ── */
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    mapRef.current.setStyle(MAP_STYLES[mapStyle]);
  }, [mapStyle, mapReady]);

  /* ── Add / update route polylines ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const addRoutes = () => {
      buses.forEach((bus, busIdx) => {
        const sourceId = `route-${bus.id}`;
        const layerId = `route-line-${bus.id}`;

        const route =
          bus.routePoints && bus.routePoints.length > 1
            ? bus.routePoints.map((pt) => [pt[1], pt[0]] as [number, number])
            : DEMO_ROUTES[busIdx % DEMO_ROUTES.length];

        const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        };

        if (map.getSource(sourceId)) {
          (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
        } else {
          map.addSource(sourceId, { type: 'geojson', data: geojson });
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#0ea5e9',
              'line-width': 4,
              'line-opacity': 0.6,
              'line-blur': 1,
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });

          // Glow layer
          map.addLayer({
            id: `${layerId}-glow`,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#0ea5e9',
              'line-width': 10,
              'line-opacity': 0.15,
              'line-blur': 6,
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });
        }
      });
    };

    // Routes need to be re-added after style changes
    if (map.isStyleLoaded()) {
      addRoutes();
    } else {
      map.once('styledata', addRoutes);
    }
  }, [buses, mapReady, mapStyle]);

  /* ── Animate bus markers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Clear old markers for buses that no longer exist
    const currentIds = new Set(buses.map((b) => b.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Create / update markers
    buses.forEach((bus, busIdx) => {
      const route =
        bus.routePoints && bus.routePoints.length > 1
          ? bus.routePoints.map((pt) => [pt[1], pt[0]] as [number, number])
          : DEMO_ROUTES[busIdx % DEMO_ROUTES.length];

      if (!markersRef.current.has(bus.id)) {
        // Create new marker
        const el = createBusMarkerElement(bus.status, bus.number);
        el.addEventListener('click', () => {
          if (!showInfoPanel) return;
          const lngLat = markersRef.current.get(bus.id)?.getLngLat();
          setSelectedBus({
            id: bus.id,
            number: bus.number,
            routeName: bus.routeName,
            status: bus.status,
            speed: bus.location?.speed ?? 0,
            occupancy: bus.currentOccupancy,
            capacity: bus.capacity,
            driverName: bus.driver?.user?.name,
            lat: lngLat?.lat ?? CHENNAI_CENTER[1],
            lng: lngLat?.lng ?? CHENNAI_CENTER[0],
          });
        });

        const startPos = bus.location
          ? [bus.location.longitude, bus.location.latitude] as [number, number]
          : route[0];

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(startPos)
          .addTo(map);

        markersRef.current.set(bus.id, marker);
        demoIndicesRef.current.set(bus.id, 0);
      }
    });

    // Demo movement interval with smooth lerp
    const interval = setInterval(() => {
      buses.forEach((bus, busIdx) => {
        const marker = markersRef.current.get(bus.id);
        if (!marker) return;

        // If there's real location data, use it
        if (bus.location) {
          const currentPos = marker.getLngLat();
          const targetLng = bus.location.longitude;
          const targetLat = bus.location.latitude;

          // Animate smoothly
          let t = 0;
          const animate = () => {
            t += 0.05;
            if (t >= 1) t = 1;
            const lng = lerpCoord(currentPos.lng, targetLng, t);
            const lat = lerpCoord(currentPos.lat, targetLat, t);
            marker.setLngLat([lng, lat]);
            if (t < 1) {
              animFrameRef.current = requestAnimationFrame(animate);
            }
          };
          animate();
          return;
        }

        // Demo movement
        const route = DEMO_ROUTES[busIdx % DEMO_ROUTES.length];
        const currentIndex = (demoIndicesRef.current.get(bus.id) || 0) % route.length;
        const nextIndex = (currentIndex + 1) % route.length;
        const from = route[currentIndex];
        const to = route[nextIndex];

        let t = 0;
        const animate = () => {
          t += 0.02;
          if (t >= 1) t = 1;
          const lng = lerpCoord(from[0], to[0], t);
          const lat = lerpCoord(from[1], to[1], t);
          marker.setLngLat([lng, lat]);
          if (t < 1) {
            animFrameRef.current = requestAnimationFrame(animate);
          }
        };
        animate();

        demoIndicesRef.current.set(bus.id, nextIndex);
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [buses, mapReady, showInfoPanel]);

  /* ── User location marker ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (showUserMarker && userLocation) {
      if (!userMarkerRef.current) {
        const el = createUserMarkerElement();
        userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map);
      } else {
        userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      }
    } else {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
    }
  }, [userLocation, showUserMarker, mapReady]);

  /* ── Fullscreen toggle ── */
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  /* ── Fly to center ── */
  const flyToCenter = useCallback(() => {
    mapRef.current?.flyTo({
      center: CHENNAI_CENTER,
      zoom: 12,
      pitch: 45,
      bearing: -15,
      duration: 1200,
    });
  }, []);

  /* ── Fly to user location ── */
  const flyToUser = useCallback(() => {
    if (!userLocation || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [userLocation]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-border shadow-2xl ${heightClassName} ${className}`}
    >
      {/* ── MapLibre Container ── */}
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* ── Live Indicator ── */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <span className="text-xs font-medium text-white/90">Live Tracking</span>
      </div>

      {/* ── Floating Controls ── */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        <button
          onClick={flyToCenter}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all"
          title="Reset View"
        >
          <Layers className="h-4 w-4" />
        </button>
        {userLocation && (
          <button
            onClick={flyToUser}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all"
            title="Go to your location"
          >
            <Locate className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => setMapStyle((s) => (s === 'dark' ? 'street' : 'dark'))}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all"
          title="Toggle Map Style"
        >
          <MapPin className="h-4 w-4" />
        </button>
      </div>

      {/* ── Zoom Controls ── */}
      <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-1">
        <button
          onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all text-lg font-bold"
        >
          +
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all text-lg font-bold"
        >
          −
        </button>
      </div>

      {/* ── Legend Panel (glassmorphism) ── */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-4 z-30 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-4 min-w-[200px]"
        >
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Radio className="h-3.5 w-3.5" /> Fleet Status
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
              Active — On Route
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-3 h-3 rounded-full bg-slate-500 shrink-0" />
              Inactive — Off Duty
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
              Maintenance
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
              Your Location
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/50">Total Buses</span>
            <span className="text-sm font-bold text-white">{buses.length}</span>
          </div>
        </motion.div>
      )}

      {/* ── Bus Info Panel (click on a bus) ── */}
      <AnimatePresence>
        {selectedBus && showInfoPanel && (
          <motion.div
            key="bus-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="absolute top-4 right-14 z-30 w-[300px] rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Bus className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{selectedBus.number}</p>
                  <p className="text-white/50 text-xs">{selectedBus.routeName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> Status
                </p>
                <p className="text-sm font-semibold text-white">{selectedBus.status}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1">
                  <Gauge className="h-3 w-3" /> Speed
                </p>
                <p className="text-sm font-semibold text-white">{Math.round(selectedBus.speed)} km/h</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Occupancy
                </p>
                <p className="text-sm font-semibold text-white">
                  {selectedBus.occupancy ?? 0}/{selectedBus.capacity ?? 45}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Coords
                </p>
                <p className="text-xs font-mono text-white/80">
                  {selectedBus.lat.toFixed(4)}, {selectedBus.lng.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Driver Info */}
            {selectedBus.driverName && (
              <div className="px-4 pb-4">
                <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Driver</p>
                    <p className="text-sm text-white font-medium">{selectedBus.driverName}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Marker pulse animation ── */}
      <style>{`
        @keyframes markerPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .maplibregl-ctrl-attrib { font-size: 10px !important; opacity: 0.5; }
        .maplibregl-ctrl-attrib a { color: rgba(255,255,255,0.5) !important; }
      `}</style>
    </div>
  );
}
