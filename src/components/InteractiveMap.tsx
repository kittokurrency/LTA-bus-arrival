import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusStop, LiveBusTelemetry, BusRouteInfo } from '../types/bus';
import { Maximize2, Compass, Layers } from 'lucide-react';
import { getLoadMeta } from '../utils/busFormatters';

interface InteractiveMapProps {
  selectedStop: BusStop;
  nearbyStops: BusStop[];
  liveBuses: LiveBusTelemetry[];
  routeInfo: BusRouteInfo | null;
  selectedServiceNo: string | null;
  onSelectStop: (stop: BusStop) => void;
  onSelectService: (serviceNo: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedStop,
  nearbyStops,
  liveBuses,
  routeInfo,
  selectedServiceNo,
  onSelectStop,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedStop.Latitude, selectedStop.Longitude],
        zoom: 16,
        zoomControl: false,
      });

      // CartoDB Positron / OSM tiles for crisp Singapore streets and landmarks
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Keep map alive unless unmounted
    };
  }, []);

  // Center when selectedStop changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedStop) {
      mapInstanceRef.current.flyTo([selectedStop.Latitude, selectedStop.Longitude], 16, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedStop.BusStopCode]);

  // Update markers and route polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Draw Route Polyline if route is active
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (routeInfo && routeInfo.Stops.length > 1) {
      const latLngs: L.LatLngExpression[] = routeInfo.Stops.map((s) => [s.Latitude, s.Longitude]);
      routeLayerRef.current = L.polyline(latLngs, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);
    }

    // 2. Render Nearby Bus Stops
    nearbyStops.forEach((stop) => {
      const isCurrent = stop.BusStopCode === selectedStop.BusStopCode;
      if (isCurrent) return; // Will render current stop specially

      const customStopIcon = L.divIcon({
        className: 'custom-bus-stop',
        html: `
          <div class="cursor-pointer group flex flex-col items-center">
            <div class="w-6 h-6 rounded-full bg-white border-2 border-slate-600 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-700 hover:scale-110 transition-transform">
              🚏
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap mt-1 pointer-events-none">
              ${stop.BusStopCode} · ${stop.Description}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([stop.Latitude, stop.Longitude], { icon: customStopIcon });
      marker.on('click', () => {
        onSelectStop(stop);
      });
      marker.addTo(markersLayer);
    });

    // 3. Render Current Selected Bus Stop
    const currentStopIcon = L.divIcon({
      className: 'current-stop-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div class="w-9 h-9 rounded-2xl bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black z-20">
            🚏
          </div>
          <div class="mt-1.5 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md border border-slate-700 whitespace-nowrap z-20">
            ${selectedStop.BusStopCode} · ${selectedStop.Description}
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([selectedStop.Latitude, selectedStop.Longitude], { icon: currentStopIcon, zIndexOffset: 500 }).addTo(
      markersLayer
    );

    // 4. Render Live Moving Buses
    liveBuses.forEach((bus) => {
      const load = getLoadMeta(bus.load);
      const isSelectedRoute = selectedServiceNo === bus.serviceNo;

      const busIconHtml = `
        <div class="cursor-pointer relative flex flex-col items-center group">
          <div class="flex items-center gap-1 bg-slate-950 text-white px-2 py-1 rounded-xl shadow-xl border-2 ${
            isSelectedRoute ? 'border-emerald-400 scale-105' : 'border-slate-300'
          }">
            <div class="w-2.5 h-2.5 rounded-full ${load.dotColor}"></div>
            <span class="text-xs font-black tracking-tight font-mono">${bus.serviceNo}</span>
            <span class="text-[9px] bg-slate-800 text-slate-300 px-1 rounded font-semibold">${bus.type}</span>
          </div>
          <div class="w-2 h-2 bg-slate-950 rotate-45 -mt-1 shadow-xs"></div>
          <div class="opacity-90 bg-white/95 text-slate-800 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow mt-1 border border-slate-200 whitespace-nowrap">
            ${bus.etaMinutes}m · ${bus.distanceMeters}m
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'live-bus-marker',
        html: busIconHtml,
        iconSize: [50, 40],
        iconAnchor: [25, 20],
      });

      const busMarker = L.marker([bus.latitude, bus.longitude], {
        icon: busIcon,
        zIndexOffset: isSelectedRoute ? 1000 : 800,
      });

      const popupHtml = `
        <div class="p-2 min-w-[180px]">
          <div class="flex items-center justify-between pb-1 border-b border-slate-200">
            <span class="text-base font-black text-slate-900">Service ${bus.serviceNo}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${load.bgLight} ${load.textColor}">${load.label}</span>
          </div>
          <div class="text-xs text-slate-600 mt-2 space-y-1">
            <p><strong>Plate:</strong> ${bus.plate}</p>
            <p><strong>Speed:</strong> ${bus.speed} km/h</p>
            <p><strong>Next Stop:</strong> ${bus.nextStopName}</p>
            <p><strong>Distance to Stop:</strong> ${bus.distanceMeters}m</p>
            <p><strong>Estimated Arrival:</strong> ~${bus.etaMinutes} mins</p>
          </div>
        </div>
      `;

      busMarker.bindPopup(popupHtml);
      busMarker.addTo(markersLayer);
    });
  }, [selectedStop, nearbyStops, liveBuses, routeInfo, selectedServiceNo]);

  const handleCenterOnStop = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedStop.Latitude, selectedStop.Longitude], 16, {
        animate: true,
      });
    }
  };

  const handleFitOverview = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([1.3521, 103.8198], 12, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Legend & Control Strip */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Status card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Singapore Transit Radar</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs text-slate-500 font-mono">
            {liveBuses.length} Active {liveBuses.length === 1 ? 'Bus' : 'Buses'}
          </span>
        </div>

        {/* Capacity Legend */}
        <div className="hidden sm:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Seats Avail</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Standing</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Packed</span>
          </div>
        </div>
      </div>

      {/* Quick Action Floating Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleCenterOnStop}
          title="Center on selected bus stop"
          className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitOverview}
          title="View full Singapore map"
          className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
