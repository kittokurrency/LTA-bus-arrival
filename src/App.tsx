/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { BusArrivalCard } from './components/BusArrivalCard';
import { InteractiveMap } from './components/InteractiveMap';
import { RouteSequenceModal } from './components/RouteSequenceModal';
import { ArrivalAlarmModal, playArrivalChime } from './components/ArrivalAlarmModal';
import { BackendConfigModal } from './components/BackendConfigModal';
import { AlarmToast } from './components/AlarmToast';
import { RouteExplorerView } from './components/RouteExplorerView';
import { FavoritesView } from './components/FavoritesView';
import { BusStop, BusServiceArrival, BusArrivalData, LiveBusTelemetry, BusAlarm, BusRouteInfo } from './types/bus';
import { getAllBusStops, getBusArrivals, getBusRoute, getLiveBuses, getBackendConfig } from './services/ltaBusApi';
import { BUS_ROUTES } from './data/singaporeBusData';
import { MapPin, TrainTrack, Star, Clock, Filter, Bus, Layers } from 'lucide-react';
import { getSecondsRemaining } from './utils/busFormatters';

export default function App() {
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [arrivalsData, setArrivalsData] = useState<BusArrivalData | null>(null);
  const [liveBuses, setLiveBuses] = useState<LiveBusTelemetry[]>([]);
  const [selectedServiceForMap, setSelectedServiceForMap] = useState<string | null>(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState<BusRouteInfo | null>(null);

  // Filter & tab states
  const [activeTab, setActiveTab] = useState<'arrivals' | 'routes' | 'favorites' | 'backend'>('arrivals');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'favorites' | 'dd'>('all');

  // Refresh & timer states
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(15);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Favorites state
  const [favoriteStopCodes, setFavoriteStopCodes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sg_bus_favorite_stops');
      return stored ? JSON.parse(stored) : ['01012', '03211', '09048'];
    } catch {
      return ['01012', '03211'];
    }
  });

  const [favoriteServices, setFavoriteServices] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sg_bus_favorite_services');
      return stored ? JSON.parse(stored) : ['190', '14', '65'];
    } catch {
      return ['190', '14'];
    }
  });

  // Alarms
  const [alarms, setAlarms] = useState<BusAlarm[]>(() => {
    try {
      const stored = localStorage.getItem('sg_bus_alarms');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeAlertToast, setActiveAlertToast] = useState<BusAlarm | null>(null);

  // Modals
  const [routeModalService, setRouteModalService] = useState<string | null>(null);
  const [alarmModalData, setAlarmModalData] = useState<{ serviceNo: string; initialEtaMin: number } | null>(null);
  const [backendModalOpen, setBackendModalOpen] = useState<boolean>(false);

  // Save favorites & alarms to localStorage
  useEffect(() => {
    localStorage.setItem('sg_bus_favorite_stops', JSON.stringify(favoriteStopCodes));
  }, [favoriteStopCodes]);

  useEffect(() => {
    localStorage.setItem('sg_bus_favorite_services', JSON.stringify(favoriteServices));
  }, [favoriteServices]);

  useEffect(() => {
    localStorage.setItem('sg_bus_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Load initial bus stops
  useEffect(() => {
    getAllBusStops().then((stops) => {
      setBusStops(stops);
      // Pick first stop or Victoria St - Hotel Grand Pacific
      const defaultStop = stops.find((s) => s.BusStopCode === '01012') || stops[0];
      setSelectedStop(defaultStop);
    });
  }, []);

  // Fetch arrivals whenever selectedStop changes
  const fetchArrivals = useCallback(async (stopCode: string) => {
    setIsRefreshing(true);
    try {
      const data = await getBusArrivals(stopCode);
      setArrivalsData(data);
      setLastUpdated(new Date());

      // Also refresh live bus GPS telemetry
      if (selectedStop) {
        const topService = selectedServiceForMap || data.Services[0]?.ServiceNo || '190';
        const buses = await getLiveBuses(topService, selectedStop);
        setLiveBuses(buses);
      }
    } catch (err) {
      console.error('Error fetching arrivals:', err);
    } finally {
      setIsRefreshing(false);
      const cfg = getBackendConfig();
      setRefreshCountdown(cfg.refreshIntervalSec || 15);
    }
  }, [selectedStop, selectedServiceForMap]);

  useEffect(() => {
    if (selectedStop) {
      fetchArrivals(selectedStop.BusStopCode);
    }
  }, [selectedStop?.BusStopCode]);

  // Update route polyline when selectedServiceForMap changes
  useEffect(() => {
    if (selectedServiceForMap) {
      getBusRoute(selectedServiceForMap).then((r) => setActiveRouteInfo(r));
      if (selectedStop) {
        getLiveBuses(selectedServiceForMap, selectedStop).then((b) => setLiveBuses(b));
      }
    } else {
      setActiveRouteInfo(null);
    }
  }, [selectedServiceForMap, selectedStop]);

  // 1-second interval ticker for countdowns and auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      // Check active alarms
      if (arrivalsData && alarms.length > 0) {
        alarms.forEach((alarm) => {
          if (alarm.triggered) return;
          if (alarm.busStopCode === arrivalsData.BusStopCode) {
            const svc = arrivalsData.Services.find((s) => s.ServiceNo === alarm.serviceNo);
            if (svc && svc.NextBus?.EstimatedArrival) {
              const sec = getSecondsRemaining(svc.NextBus.EstimatedArrival);
              const min = Math.ceil(sec / 60);
              if (min <= alarm.triggerMinutes) {
                // Trigger alarm
                playArrivalChime();
                setActiveAlertToast(alarm);
                setAlarms((prev) =>
                  prev.map((a) => (a.id === alarm.id ? { ...a, triggered: true } : a))
                );
              }
            }
          }
        });
      }

      if (!autoRefreshEnabled) return;

      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          if (selectedStop) {
            fetchArrivals(selectedStop.BusStopCode);
          }
          const cfg = getBackendConfig();
          return cfg.refreshIntervalSec || 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, selectedStop, fetchArrivals, arrivalsData, alarms]);

  // Stop selector helper
  const handleSelectStop = (stop: BusStop) => {
    setSelectedStop(stop);
    setSelectedServiceForMap(null);
  };

  const handleSelectStopCode = (code: string) => {
    const found = busStops.find((s) => s.BusStopCode === code);
    if (found) {
      setSelectedStop(found);
      setSelectedServiceForMap(null);
    }
  };

  // Toggle favorite stop
  const toggleFavoriteStop = (code: string) => {
    setFavoriteStopCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Toggle favorite service
  const toggleFavoriteService = (serviceNo: string) => {
    setFavoriteServices((prev) =>
      prev.includes(serviceNo) ? prev.filter((s) => s !== serviceNo) : [...prev, serviceNo]
    );
  };

  // Add new alarm
  const handleSaveAlarm = (newAlarm: Omit<BusAlarm, 'id' | 'createdAt' | 'triggered'>) => {
    const alarm: BusAlarm = {
      ...newAlarm,
      id: `alarm-${Date.now()}`,
      createdAt: Date.now(),
      triggered: false,
    };
    setAlarms((prev) => [...prev, alarm]);
  };

  // Filtered bus services
  const displayedServices = useMemo(() => {
    if (!arrivalsData) return [];
    let list = [...arrivalsData.Services];

    if (serviceFilter === 'favorites') {
      list = list.filter((s) => favoriteServices.includes(s.ServiceNo));
    } else if (serviceFilter === 'dd') {
      list = list.filter((s) => s.NextBus?.Type === 'DD' || s.NextBus2?.Type === 'DD');
    }

    return list;
  }, [arrivalsData, serviceFilter, favoriteServices]);

  // Nearby stops within Singapore data
  const nearbyStops = useMemo(() => {
    if (!selectedStop) return busStops.slice(0, 8);
    if (selectedRegion !== 'All') {
      return busStops.filter((s) => s.hubRegion === selectedRegion);
    }
    return busStops;
  }, [busStops, selectedStop, selectedRegion]);

  const isCurrentStopFavorite = selectedStop ? favoriteStopCodes.includes(selectedStop.BusStopCode) : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'backend') {
            setBackendModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onRefresh={() => selectedStop && fetchArrivals(selectedStop.BusStopCode)}
        isRefreshing={isRefreshing}
        autoRefreshEnabled={autoRefreshEnabled}
        toggleAutoRefresh={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
        favoritesCount={favoriteStopCodes.length}
        openBackendModal={() => setBackendModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16 sm:pb-8">
        {activeTab === 'routes' ? (
          <RouteExplorerView
            onSelectStopAndSwitchToArrivals={(stop) => {
              handleSelectStop(stop);
              setActiveTab('arrivals');
            }}
            liveBuses={liveBuses}
          />
        ) : activeTab === 'favorites' ? (
          <FavoritesView
            favoriteStopCodes={favoriteStopCodes}
            favoriteServices={favoriteServices}
            allBusStops={busStops}
            onSelectStop={handleSelectStop}
            onRemoveFavoriteStop={toggleFavoriteStop}
            onRemoveFavoriteService={toggleFavoriteService}
            onSwitchToArrivals={() => setActiveTab('arrivals')}
          />
        ) : (
          /* Live Arrivals Main Hub */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
            {/* Search, Location, and Region Bar */}
            <SearchAndFilterBar
              busStops={busStops}
              selectedStop={selectedStop || busStops[0]}
              onSelectStop={handleSelectStop}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />

            {/* Selected Bus Stop Identity Banner */}
            {selectedStop && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-extrabold px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-emerald-600">
                        {selectedStop.BusStopCode}
                      </span>
                      {selectedStop.hubRegion && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {selectedStop.hubRegion} Hub
                        </span>
                      )}
                      {selectedStop.mrtLines && selectedStop.mrtLines.length > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <TrainTrack className="w-3.5 h-3.5 text-slate-400" />
                          <span>MRT: {selectedStop.mrtLines.join(' / ')}</span>
                        </div>
                      )}
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
                      {selectedStop.Description}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedStop.RoadName} · Singapore
                    </p>
                  </div>
                </div>

                {/* Right Action: Bookmark + Countdown Status */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] text-slate-400 font-medium">Auto-refreshing in</p>
                    <p className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {refreshCountdown}s
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavoriteStop(selectedStop.BusStopCode)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      isCurrentStopFavorite
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isCurrentStopFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    <span>{isCurrentStopFavorite ? 'Saved Stop' : 'Bookmark Stop'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Split 2-Column Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Bus Arrivals Feed */}
              <div className="lg:col-span-7 space-y-4">
                {/* Filter & Sort Controls */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setServiceFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        serviceFilter === 'all'
                          ? 'bg-slate-900 text-white dark:bg-emerald-600'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      All Services ({arrivalsData?.Services.length || 0})
                    </button>
                    <button
                      onClick={() => setServiceFilter('favorites')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                        serviceFilter === 'favorites'
                          ? 'bg-slate-900 text-white dark:bg-emerald-600'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      <span>Saved</span>
                    </button>
                    <button
                      onClick={() => setServiceFilter('dd')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                        serviceFilter === 'dd'
                          ? 'bg-slate-900 text-white dark:bg-emerald-600'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Double Deck</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Arrivals List */}
                {displayedServices.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
                    <Bus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No bus services matching filter
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try selecting &quot;All Services&quot; or clearing your filter.
                    </p>
                    <button
                      onClick={() => setServiceFilter('all')}
                      className="mt-3 px-3 py-1.5 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {displayedServices.map((service) => (
                      <BusArrivalCard
                        key={service.ServiceNo}
                        service={service}
                        busStopCode={selectedStop?.BusStopCode || '01012'}
                        isSelectedForMap={selectedServiceForMap === service.ServiceNo}
                        isFavorite={favoriteServices.includes(service.ServiceNo)}
                        onSelectForMap={(svc) => {
                          setSelectedServiceForMap(selectedServiceForMap === svc ? null : svc);
                        }}
                        onOpenRoute={(svc) => setRouteModalService(svc)}
                        onOpenAlarm={(svc, etaMin) => setAlarmModalData({ serviceNo: svc, initialEtaMin: etaMin })}
                        onToggleFavorite={toggleFavoriteService}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Live Map & Nearby Stops */}
              <div className="lg:col-span-5 space-y-4">
                {/* Map Card */}
                <div className="h-[460px] sm:h-[500px]">
                  {selectedStop && (
                    <InteractiveMap
                      selectedStop={selectedStop}
                      nearbyStops={nearbyStops}
                      liveBuses={liveBuses}
                      routeInfo={activeRouteInfo}
                      selectedServiceNo={selectedServiceForMap}
                      onSelectStop={handleSelectStop}
                      onSelectService={(svc) => setSelectedServiceForMap(svc)}
                    />
                  )}
                </div>

                {/* Nearby Bus Stops Quick Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                    <span>Nearby Transit Stops ({nearbyStops.length})</span>
                    <span className="font-normal text-[11px] text-slate-500">Tap to switch stop</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyStops.slice(0, 6).map((stop) => {
                      const isCurrent = stop.BusStopCode === selectedStop?.BusStopCode;
                      return (
                        <button
                          key={stop.BusStopCode}
                          onClick={() => handleSelectStop(stop)}
                          className={`text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                            isCurrent
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 font-bold text-emerald-800 dark:text-emerald-200 shadow-xs'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="truncate pr-1">
                            <span className="font-mono font-bold block">{stop.BusStopCode}</span>
                            <span className="truncate block text-slate-600 dark:text-slate-300 text-[11px]">
                              {stop.Description}
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Route Sequence Modal */}
      {routeModalService && (
        <RouteSequenceModal
          route={BUS_ROUTES[routeModalService] || null}
          serviceNo={routeModalService}
          currentStopCode={selectedStop?.BusStopCode || '01012'}
          liveBuses={liveBuses.filter((b) => b.serviceNo === routeModalService)}
          onClose={() => setRouteModalService(null)}
          onSelectStopCode={handleSelectStopCode}
        />
      )}

      {/* Arrival Alarm Modal */}
      {alarmModalData && selectedStop && (
        <ArrivalAlarmModal
          serviceNo={alarmModalData.serviceNo}
          busStopCode={selectedStop.BusStopCode}
          busStopName={selectedStop.Description}
          initialEtaMin={alarmModalData.initialEtaMin}
          onSaveAlarm={handleSaveAlarm}
          onClose={() => setAlarmModalData(null)}
        />
      )}

      {/* Backend Settings & Proxy Documentation Modal */}
      {backendModalOpen && (
        <BackendConfigModal
          onClose={() => setBackendModalOpen(false)}
          onConfigUpdated={() => {
            if (selectedStop) {
              fetchArrivals(selectedStop.BusStopCode);
            }
          }}
        />
      )}

      {/* Live Alarm Trigger Toast */}
      {activeAlertToast && (
        <AlarmToast
          alarm={activeAlertToast}
          onDismiss={() => setActiveAlertToast(null)}
        />
      )}

      {/* Mobile Ergonomic Bottom Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center h-16 pb-safe">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            activeTab === 'arrivals' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Bus className="w-5 h-5" />
          <span className="text-[10px] mt-1">Arrivals</span>
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            activeTab === 'routes' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-1">Routes</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] relative ${
            activeTab === 'favorites' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Star className="w-5 h-5" />
          <span className="text-[10px] mt-1">Saved</span>
          {favoriteStopCodes.length > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setBackendModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-1">API Hub</span>
        </button>
      </div>
    </div>
  );
}
