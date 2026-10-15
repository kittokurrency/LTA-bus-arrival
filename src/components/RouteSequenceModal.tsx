import React from 'react';
import { X, Clock, MapPin, ArrowRight, Bus as BusIcon, Radio } from 'lucide-react';
import { BusRouteInfo, BusStop, LiveBusTelemetry } from '../types/bus';
import { OPERATOR_DETAILS } from '../data/singaporeBusData';

interface RouteSequenceModalProps {
  route: BusRouteInfo | null;
  serviceNo: string;
  currentStopCode: string;
  liveBuses: LiveBusTelemetry[];
  onClose: () => void;
  onSelectStopCode: (code: string) => void;
}

export const RouteSequenceModal: React.FC<RouteSequenceModalProps> = ({
  route,
  serviceNo,
  currentStopCode,
  liveBuses,
  onClose,
  onSelectStopCode,
}) => {
  if (!route) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <p className="text-slate-600 dark:text-slate-300">Route details for service {serviceNo} are currently being synthesized.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const opInfo = OPERATOR_DETAILS[route.Operator] || OPERATOR_DETAILS.SBST;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="min-w-[54px] h-12 rounded-xl bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center">
              {route.ServiceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border ${opInfo.badgeBg} ${opInfo.textClass}`}>
                  {opInfo.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">Direction {route.Direction}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
                <span>{route.OriginName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span>{route.DestinationName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule & Operational Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-6 py-3.5 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <p className="text-slate-400 font-medium">Operating Hours</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {route.FirstBusWeekday} - {route.LastBusWeekday}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            <div>
              <p className="text-slate-400 font-medium">Peak Frequency</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                Every {route.FrequencyPeakMin} mins
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <BusIcon className="w-3.5 h-3.5 text-blue-500" />
            <div>
              <p className="text-slate-400 font-medium">Active Buses on Radar</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {liveBuses.length} en route
              </p>
            </div>
          </div>
        </div>

        {/* Stop Progression Timeline */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Route Stops Sequence ({route.Stops.length} stops) · Tap any stop to inspect arrivals
          </p>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {route.Stops.map((stop, index) => {
              const isSelected = stop.BusStopCode === currentStopCode;
              // Check if any bus is currently close to this stop
              const approachingBus = liveBuses.find((b) => b.nextStopCode === stop.BusStopCode);

              return (
                <div key={stop.BusStopCode} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 transition-transform ${
                      isSelected
                        ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/30 scale-110 z-10'
                        : 'bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-600 group-hover:border-emerald-500'
                    }`}
                  />

                  <div
                    onClick={() => {
                      onSelectStopCode(stop.BusStopCode);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400/80 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {stop.BusStopCode}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {stop.DistanceKm.toFixed(1)} km
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                              Current Stop
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                          {stop.Description}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {stop.RoadName}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-xs text-slate-400 font-mono">#{stop.StopSequence}</span>
                      </div>
                    </div>

                    {/* Approaching bus alert along the timeline */}
                    {approachingBus && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <BusIcon className="w-3.5 h-3.5 animate-bounce" />
                          <span>Bus {approachingBus.plate} approaching</span>
                        </div>
                        <span className="font-mono font-bold">~{approachingBus.etaMinutes}m away</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
