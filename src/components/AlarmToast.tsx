import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { BusAlarm } from '../types/bus';

interface AlarmToastProps {
  alarm: BusAlarm;
  onDismiss: (id: string) => void;
}

export const AlarmToast: React.FC<AlarmToastProps> = ({ alarm, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/80 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
        <Bell className="w-5 h-5 animate-bounce" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
            Bus Arrival Alert!
          </span>
          <button
            onClick={() => onDismiss(alarm.id)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm font-bold mt-0.5">
          Service {alarm.serviceNo} is arriving!
        </p>
        <p className="text-xs text-slate-300 mt-1">
          Bus is now within {alarm.triggerMinutes} min of <span className="font-semibold">{alarm.busStopName}</span> ({alarm.busStopCode}).
        </p>

        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={() => onDismiss(alarm.id)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Got it, heading out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
