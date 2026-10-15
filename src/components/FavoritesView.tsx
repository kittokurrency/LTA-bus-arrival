import React from 'react';
import { BusStop, BusServiceArrival } from '../types/bus';
import { Bookmark, Star, ArrowRight, Bus, Layers } from 'lucide-react';
import { formatArrivalTime, getLoadMeta } from '../utils/busFormatters';
import { STOP_SERVICES_MAP, OPERATOR_DETAILS, SERVICE_OPERATOR_MAP } from '../data/singaporeBusData';

interface FavoritesViewProps {
  favoriteStopCodes: string[];
  favoriteServices: string[];
  allBusStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onRemoveFavoriteStop: (code: string) => void;
  onRemoveFavoriteService: (serviceNo: string) => void;
  onSwitchToArrivals: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteStopCodes,
  favoriteServices,
  allBusStops,
  onSelectStop,
  onRemoveFavoriteStop,
  onRemoveFavoriteService,
  onSwitchToArrivals,
}) => {
  const savedStops = allBusStops.filter((s) => favoriteStopCodes.includes(s.BusStopCode));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-500" />
            <span>Saved Stops & Pinned Bus Services</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly monitor your daily commute hub arrivals without searching
          </p>
        </div>
      </div>

      {savedStops.length === 0 && favoriteServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No saved favorites yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the star icon on any bus stop or bus arrival card to bookmark it for rapid 1-tap tracking.
          </p>
          <button
            onClick={onSwitchToArrivals}
            className="mt-5 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Explore Live Bus Stops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedStops.map((stop) => {
            const services = STOP_SERVICES_MAP[stop.BusStopCode] || [];

            return (
              <div
                key={stop.BusStopCode}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                      {stop.BusStopCode}
                    </span>
                    <button
                      onClick={() => onRemoveFavoriteStop(stop.BusStopCode)}
                      title="Remove bookmark"
                      className="text-amber-500 hover:text-slate-400 p-1"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                    {stop.Description}
                  </h3>
                  <p className="text-xs text-slate-500">{stop.RoadName}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Available Bus Services ({services.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {services.map((svc) => (
                        <span
                          key={svc}
                          className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectStop(stop);
                      onSwitchToArrivals();
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>View Real-Time Arrivals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
