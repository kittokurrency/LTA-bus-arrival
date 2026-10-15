import React from 'react';
import { Bus, Settings, RefreshCw, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeTab: 'arrivals' | 'routes' | 'favorites' | 'backend';
  setActiveTab: (tab: 'arrivals' | 'routes' | 'favorites' | 'backend') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
  favoritesCount: number;
  openBackendModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  autoRefreshEnabled,
  toggleAutoRefresh,
  favoritesCount,
  openBackendModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bus className="w-5 h-5" />
          </div>
          <button
            onClick={() => setActiveTab('arrivals')}
            className="text-left font-bold tracking-tight text-lg sm:text-xl text-white hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            SG BUS ARRIVAL
          </button>
        </div>

        {/* Zone 2: Single-line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'arrivals' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Live Arrivals
            {activeTab === 'arrivals' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'routes' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Route Tracker
            {activeTab === 'routes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'favorites' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Stops</span>
            {favoritesCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {favoritesCount}
              </span>
            )}
            {activeTab === 'favorites' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => openBackendModal()}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'backend' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            <span>LTA DataMall API</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title={autoRefreshEnabled ? "Auto-refresh active (15s)" : "Click to refresh"}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </span>
          </button>

          <button
            onClick={openBackendModal}
            title="Backend & API Settings"
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
