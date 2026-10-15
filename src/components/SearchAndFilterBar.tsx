import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, X, TrainTrack } from 'lucide-react';
import { BusStop } from '../types/bus';
import { STOP_SERVICES_MAP } from '../data/singaporeBusData';

interface SearchAndFilterBarProps {
  busStops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  busStops,
  selectedStop,
  onSelectStop,
  selectedRegion,
  setSelectedRegion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStops = busStops.filter((stop) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const matchesCode = stop.BusStopCode.toLowerCase().includes(q);
    const matchesDesc = stop.Description.toLowerCase().includes(q);
    const matchesRoad = stop.RoadName.toLowerCase().includes(q);
    const services = STOP_SERVICES_MAP[stop.BusStopCode] || [];
    const matchesService = services.some((s) => s.toLowerCase() === q);

    return matchesCode || matchesDesc || matchesRoad || matchesService;
  });

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        // Find nearest stop by euclidean distance
        let nearest = busStops[0];
        let minDist = Infinity;
        busStops.forEach((stop) => {
          const d = Math.hypot(stop.Latitude - latitude, stop.Longitude - longitude);
          if (d < minDist) {
            minDist = d;
            nearest = stop;
          }
        });
        onSelectStop(nearest);
      },
      () => {
        setIsLocating(false);
        // Default to Orchard Rd (09048) if permission denied
        const orchard = busStops.find((s) => s.BusStopCode === '09048');
        if (orchard) onSelectStop(orchard);
      },
      { timeout: 8000 }
    );
  };

  const regions = ['All', 'Central', 'East', 'West', 'North', 'North-East'];

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Search Bar Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          placeholder="Search by 5-digit stop code, road, landmark, or bus # (e.g. 01012, Orchard, 190)..."
          className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />

        <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleUseLocation}
            disabled={isLocating}
            title="Locate nearest Singapore bus stop"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStops.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No Singapore bus stops found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredStops.map((stop) => {
                const services = STOP_SERVICES_MAP[stop.BusStopCode] || [];
                const isSelected = stop.BusStopCode === selectedStop.BusStopCode;

                return (
                  <button
                    key={stop.BusStopCode}
                    onClick={() => {
                      onSelectStop(stop);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start justify-between gap-2 ${
                      isSelected ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {stop.BusStopCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {stop.Description}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{stop.RoadName}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {stop.mrtLines && stop.mrtLines.length > 0 && (
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                          <TrainTrack className="w-3 h-3 text-slate-400" />
                          <span>{stop.mrtLines.join('/')}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {services.length} {services.length === 1 ? 'svc' : 'svcs'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Region Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {regions.map((region) => {
          const isActive = selectedRegion === region;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all min-h-[34px] flex items-center justify-center ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-emerald-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {region === 'All' ? 'All Singapore' : region}
            </button>
          );
        })}
      </div>
    </div>
  );
};
