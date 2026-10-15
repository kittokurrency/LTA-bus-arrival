import React from 'react';
import { MapPin, Navigation, Bell, Star, Accessibility, Layers, Gauge } from 'lucide-react';
import { BusServiceArrival, NextBusInfo } from '../types/bus';
import { formatArrivalTime, getLoadMeta, getDeckLabel, getSecondsRemaining } from '../utils/busFormatters';
import { OPERATOR_DETAILS } from '../data/singaporeBusData';

interface BusArrivalCardProps {
  service: BusServiceArrival;
  busStopCode: string;
  isSelectedForMap: boolean;
  isFavorite: boolean;
  onSelectForMap: (serviceNo: string) => void;
  onOpenRoute: (serviceNo: string) => void;
  onOpenAlarm: (serviceNo: string, etaMin: number) => void;
  onToggleFavorite: (serviceNo: string) => void;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  service,
  isSelectedForMap,
  isFavorite,
  onSelectForMap,
  onOpenRoute,
  onOpenAlarm,
  onToggleFavorite,
}) => {
  const opInfo = OPERATOR_DETAILS[service.Operator] || OPERATOR_DETAILS.SBST;
  const next1 = service.NextBus;
  const next2 = service.NextBus2;
  const next3 = service.NextBus3;

  const arr1 = next1 ? formatArrivalTime(next1.EstimatedArrival) : null;
  const load1 = next1 ? getLoadMeta(next1.Load) : null;
  const sec1 = next1 ? getSecondsRemaining(next1.EstimatedArrival) : 9999;

  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelectedForMap
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500 shadow-md ring-1 ring-emerald-500'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Top Banner Row */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          {/* Service number & Destination */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center min-w-[58px] h-12 rounded-xl bg-slate-900 text-white font-extrabold text-2xl tracking-tight shadow-xs px-2.5">
              {service.ServiceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border ${opInfo.badgeBg} ${opInfo.textClass}`}>
                  {service.Operator}
                </span>
                {service.category === 'EXPRESS' && (
                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-1.5 py-0.5 rounded">
                    Express
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5 truncate max-w-[220px] sm:max-w-[320px]">
                <span>To</span>
                <span className="text-slate-900 dark:text-white truncate">
                  {service.destinationName || 'Destination'}
                </span>
              </p>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(service.ServiceNo)}
              title={isFavorite ? 'Remove from saved' : 'Save bus service'}
              className={`p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isFavorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onOpenAlarm(service.ServiceNo, arr1?.minutes ?? 5)}
              title="Set arrival alert reminder"
              className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenRoute(service.ServiceNo)}
              title="View full route sequence and bus stops"
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Arrival Prediction Tiles */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          {/* Next Bus 1 */}
          <ArrivalTile
            bus={next1}
            isPrimary={true}
            positionLabel="Next Bus"
          />

          {/* Next Bus 2 */}
          <ArrivalTile
            bus={next2}
            isPrimary={false}
            positionLabel="2nd Bus"
          />

          {/* Next Bus 3 */}
          <ArrivalTile
            bus={next3}
            isPrimary={false}
            positionLabel="3rd Bus"
          />
        </div>

        {/* Live Vehicle Telematics Bar (when bus is en route) */}
        {next1 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 truncate">
              {next1.vehiclePlate && (
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {next1.vehiclePlate}
                </span>
              )}
              {next1.distanceMeters !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{next1.distanceMeters > 1000 ? `${(next1.distanceMeters / 1000).toFixed(1)} km` : `${next1.distanceMeters} m`} away</span>
                </>
              )}
              {next1.speedKmH !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Gauge className="w-3 h-3 text-slate-400" />
                    <span>{next1.speedKmH} km/h</span>
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => onSelectForMap(service.ServiceNo)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                isSelectedForMap
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isSelectedForMap ? 'Tracking on Map' : 'Track on Map'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ArrivalTileProps {
  bus: NextBusInfo | null;
  isPrimary: boolean;
  positionLabel: string;
}

const ArrivalTile: React.FC<ArrivalTileProps> = ({ bus, isPrimary, positionLabel }) => {
  if (!bus || !bus.EstimatedArrival) {
    return (
      <div className="rounded-lg p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center items-center text-center min-h-[96px]">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{positionLabel}</span>
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">Not Active</span>
      </div>
    );
  }

  const arrival = formatArrivalTime(bus.EstimatedArrival);
  const load = getLoadMeta(bus.Load);
  const deck = getDeckLabel(bus.Type);

  return (
    <div
      className={`rounded-lg p-2.5 flex flex-col justify-between transition-colors border ${
        isPrimary
          ? `${load.bgLight} ${load.borderClass}`
          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Position Header & Capacity Dot */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {positionLabel}
        </span>
        <div className="flex items-center gap-1" title={load.label}>
          <span className={`w-2 h-2 rounded-full ${load.dotColor}`} />
          <span className={`text-[10px] font-semibold ${load.textColor}`}>
            {load.shortLabel}
          </span>
        </div>
      </div>

      {/* Arrival Time Big Metric */}
      <div className="my-1">
        <div className="flex items-baseline gap-1">
          <span className={`text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums ${
            arrival.isArr ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
          }`}>
            {arrival.label}
          </span>
          {!arrival.isArr && arrival.subLabel && (
            <span className="text-[10px] text-slate-400 font-mono">
              {arrival.subLabel}
            </span>
          )}
        </div>
      </div>

      {/* Deck & Feature Badges */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-0.5" title={deck}>
          <Layers className="w-3 h-3 text-slate-400" />
          <span>{bus.Type === 'DD' ? 'Double' : bus.Type === 'BD' ? 'Bendy' : 'Single'}</span>
        </span>
        {bus.Feature === 'WAB' && (
          <span title="Wheelchair Accessible Bus (WAB)">
            <Accessibility className="w-3 h-3 text-blue-500" />
          </span>
        )}
      </div>
    </div>
  );
};
