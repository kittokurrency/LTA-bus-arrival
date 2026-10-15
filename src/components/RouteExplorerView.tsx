import React, { useState } from 'react';
import { BusRouteInfo, BusStop, LiveBusTelemetry } from '../types/bus';
import { BUS_ROUTES, OPERATOR_DETAILS, SINGAPORE_BUS_STOPS } from '../data/singaporeBusData';
import { InteractiveMap } from './InteractiveMap';
import { Clock, Radio, Bus as BusIcon, ArrowRight, MapPin } from 'lucide-react';

interface RouteExplorerViewProps {
  onSelectStopAndSwitchToArrivals: (stop: BusStop) => void;
  liveBuses: LiveBusTelemetry[];
}

export const RouteExplorerView: React.FC<RouteExplorerViewProps> = ({
  onSelectStopAndSwitchToArrivals,
  liveBuses,
}) => {
  const routeKeys = Object.keys(BUS_ROUTES);
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>(routeKeys[0] || '190');

  const currentRoute: BusRouteInfo | null = BUS_ROUTES[selectedServiceNo] || null;
  const opInfo = currentRoute ? OPERATOR_DETAILS[currentRoute.Operator] : OPERATOR_DETAILS.SBST;

  // Use the first stop or current route stops
  const stops = currentRoute ? currentRoute.Stops : [];
  const activeStopCode = stops[0]?.BusStopCode || '01012';
  const activeBusStop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === activeStopCode) || SINGAPORE_BUS_STOPS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Route Service Selector Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Singapore Bus Route Tracker
            </h2>
            <p className="text-xs text-slate-500">
              Select any bus service to visualize its active route path, schedule, and live moving buses
            </p>
          </div>

          {/* Service number pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {routeKeys.map((svc) => (
              <button
                key={svc}
                onClick={() => setSelectedServiceNo(svc)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all min-h-[38px] min-w-[44px] flex items-center justify-center ${
                  selectedServiceNo === svc
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-600'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {svc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Route Meta & Stops Timeline */}
          <div className="lg:col-span-5 space-y-4">
            {/* Route Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 rounded-xl bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center">
                    {currentRoute.ServiceNo}
                  </div>
                  <div>
                    <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border ${opInfo.badgeBg} ${opInfo.textClass}`}>
                      {opInfo.name}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Trunk Public Service</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <span>{currentRoute.OriginName}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{currentRoute.DestinationName}</span>
              </div>

              {/* Service Frequency & Operating Hours */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>First / Last Bus</span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {currentRoute.FirstBusWeekday} – {currentRoute.LastBusWeekday}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Peak Frequency</span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    Every {currentRoute.FrequencyPeakMin} mins
                  </p>
                </div>
              </div>
            </div>

            {/* Stops Timeline List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs max-h-[520px] overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Route Stops ({stops.length}) · Click to view live arrivals
              </h3>

              <div className="space-y-3">
                {stops.map((stop, idx) => (
                  <div
                    key={stop.BusStopCode}
                    onClick={() => {
                      const fullStop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === stop.BusStopCode) || {
                        BusStopCode: stop.BusStopCode,
                        Description: stop.Description,
                        RoadName: stop.RoadName,
                        Latitude: stop.Latitude,
                        Longitude: stop.Longitude,
                      };
                      onSelectStopAndSwitchToArrivals(fullStop);
                    }}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/80 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {stop.BusStopCode}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {stop.Description}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{stop.RoadName}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-400">
                      {stop.DistanceKm.toFixed(1)} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Singapore Map */}
          <div className="lg:col-span-7 h-[600px]">
            <InteractiveMap
              selectedStop={activeBusStop}
              nearbyStops={SINGAPORE_BUS_STOPS}
              liveBuses={liveBuses.filter((b) => b.serviceNo === selectedServiceNo)}
              routeInfo={currentRoute}
              selectedServiceNo={selectedServiceNo}
              onSelectStop={(s) => onSelectStopAndSwitchToArrivals(s)}
              onSelectService={(svc) => setSelectedServiceNo(svc)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
