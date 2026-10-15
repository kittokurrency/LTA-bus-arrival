import React, { useState } from 'react';
import { X, Bell, Volume2, CheckCircle2 } from 'lucide-react';
import { BusAlarm } from '../types/bus';

interface ArrivalAlarmModalProps {
  serviceNo: string;
  busStopCode: string;
  busStopName: string;
  initialEtaMin?: number;
  onSaveAlarm: (alarm: Omit<BusAlarm, 'id' | 'createdAt' | 'triggered'>) => void;
  onClose: () => void;
}

export const playArrivalChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Pleasant dual chime sequence
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.0, now + 0.15); // A5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (err) {
    console.warn('AudioContext not allowed or supported', err);
  }
};

export const ArrivalAlarmModal: React.FC<ArrivalAlarmModalProps> = ({
  serviceNo,
  busStopCode,
  busStopName,
  initialEtaMin = 3,
  onSaveAlarm,
  onClose,
}) => {
  const [triggerMin, setTriggerMin] = useState<number>(Math.max(1, Math.min(initialEtaMin, 3)));
  const [tested, setTested] = useState(false);

  const handleTestSound = () => {
    playArrivalChime();
    setTested(true);
    setTimeout(() => setTested(false), 2000);
  };

  const handleSave = () => {
    onSaveAlarm({
      busStopCode,
      busStopName,
      serviceNo,
      triggerMinutes: triggerMin,
    });
    playArrivalChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Set Arrival Reminder
              </h3>
              <p className="text-xs text-slate-500">Service {serviceNo} · Stop {busStopCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Get an in-app audio chime and visual alert when <strong className="text-slate-900 dark:text-white">Bus {serviceNo}</strong> approaches <strong className="text-slate-900 dark:text-white">{busStopName}</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Alert Me When Bus Is:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 5].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setTriggerMin(min)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    triggerMin === min
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {min} min away
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <span>Chime Volume Test</span>
            </span>
            <button
              type="button"
              onClick={handleTestSound}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors"
            >
              {tested ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Played</span> : 'Play Tone'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors"
          >
            Activate Alert
          </button>
        </div>
      </div>
    </div>
  );
};
