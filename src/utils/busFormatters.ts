import { LoadLevel, BusDeckType } from '../types/bus';

export function getSecondsRemaining(arrivalIso: string): number {
  if (!arrivalIso) return 9999;
  const target = new Date(arrivalIso).getTime();
  const diffMs = target - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}

export function formatArrivalTime(arrivalIso: string): { label: string; subLabel: string; isArr: boolean; minutes: number } {
  if (!arrivalIso) {
    return { label: 'No Data', subLabel: 'Not in service', isArr: false, minutes: 999 };
  }

  const seconds = getSecondsRemaining(arrivalIso);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (seconds <= 45) {
    return { label: 'Arr', subLabel: 'Arriving now', isArr: true, minutes: 0 };
  }

  if (minutes === 0) {
    return { label: '< 1m', subLabel: `${seconds}s away`, isArr: true, minutes: 1 };
  }

  return {
    label: `${minutes}m`,
    subLabel: `${remainingSeconds}s`,
    isArr: false,
    minutes,
  };
}

export function getLoadMeta(load: LoadLevel): {
  label: string;
  shortLabel: string;
  textColor: string;
  bgLight: string;
  dotColor: string;
  borderClass: string;
  levelRatio: number;
} {
  switch (load) {
    case 'SEA':
      return {
        label: 'Seats Available',
        shortLabel: 'Seats',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
        dotColor: 'bg-emerald-500',
        borderClass: 'border-emerald-200 dark:border-emerald-800',
        levelRatio: 0.35,
      };
    case 'SDA':
      return {
        label: 'Standing Available',
        shortLabel: 'Standing',
        textColor: 'text-amber-700 dark:text-amber-300',
        bgLight: 'bg-amber-50 dark:bg-amber-950/40',
        dotColor: 'bg-amber-500',
        borderClass: 'border-amber-200 dark:border-amber-800',
        levelRatio: 0.7,
      };
    case 'LSD':
      return {
        label: 'Limited Standing',
        shortLabel: 'Packed',
        textColor: 'text-rose-700 dark:text-rose-300',
        bgLight: 'bg-rose-50 dark:bg-rose-950/40',
        dotColor: 'bg-rose-500',
        borderClass: 'border-rose-200 dark:border-rose-800',
        levelRatio: 0.95,
      };
    default:
      return {
        label: 'Unknown',
        shortLabel: '-',
        textColor: 'text-slate-600',
        bgLight: 'bg-slate-50',
        dotColor: 'bg-slate-400',
        borderClass: 'border-slate-200',
        levelRatio: 0.1,
      };
  }
}

export function getDeckLabel(type: BusDeckType): string {
  switch (type) {
    case 'DD':
      return 'Double Deck';
    case 'BD':
      return 'Bendy Bus';
    case 'SD':
    default:
      return 'Single Deck';
  }
}
