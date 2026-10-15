import React, { useState } from 'react';
import { X, Server, Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Terminal } from 'lucide-react';
import { BackendConfig } from '../types/bus';
import { getBackendConfig, saveBackendConfig, testBackendConnection } from '../services/ltaBusApi';

interface BackendConfigModalProps {
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({ onClose, onConfigUpdated }) => {
  const [config, setConfig] = useState<BackendConfig>(getBackendConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; sampleData?: unknown } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSave = () => {
    saveBackendConfig(config);
    onConfigUpdated();
    onClose();
  };

  const handleRunTest = async () => {
    if (!config.backendUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter a backend URL to test.',
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testBackendConnection(config.backendUrl, config.ltaApiKey);
    setIsTesting(false);
    setTestResult(result);
  };

  const sampleExpressCode = `// Serverless proxy route (/api/busarrival.ts):
// GET /api/busarrival?BusStopCode=83139
// Upstream: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139

const url = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
url.searchParams.set('BusStopCode', req.query.BusStopCode || '83139');

const response = await fetch(url.toString(), {
  headers: {
    'AccountKey': process.env.LTA_ACCOUNT_KEY || '',
    'accept': 'application/json'
  }
});
const data = await response.json();
res.json(data);`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleExpressCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Backend Connection & LTA DataMall
              </h3>
              <p className="text-xs text-slate-500">
                Switch between high-fidelity simulated Singapore data and your custom backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Data Source Mode Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {config.useCustomBackend ? 'Custom Backend Connection' : 'Real-Time Singapore Simulated Data'}
                </p>
                <p className="text-slate-500 mt-0.5">
                  {config.useCustomBackend
                    ? 'Calls your custom proxy endpoint with live LTA DataMall schema'
                    : 'Currently active: High-fidelity simulation covering all Singapore bus stops, routes, and live GPS'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useCustomBackend}
                  onChange={(e) => setConfig({ ...config, useCustomBackend: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Custom Backend URL & Key (enabled if toggled) */}
          {config.useCustomBackend && (
            <div className="space-y-4 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Backend API Endpoint URL
                  </label>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, backendUrl: '/api/busarrival' })}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Use Built-in /api/busarrival
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. /api/busarrival or https://api.mytransit.sg"
                  value={config.backendUrl}
                  onChange={(e) => setConfig({ ...config, backendUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Serverless function at <code className="text-slate-700 dark:text-slate-300">/api/busarrival.ts</code> forwards to <code className="text-slate-700 dark:text-slate-300">https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival</code>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LTA DataMall AccountKey (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Optional header if your backend requires direct key pass-through"
                  value={config.ltaApiKey}
                  onChange={(e) => setConfig({ ...config, ltaApiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs">{testResult.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Auto Refresh Frequency */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Auto-Refresh Cadence: <span className="text-emerald-600 font-bold">{config.refreshIntervalSec}s</span>
            </label>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={config.refreshIntervalSec}
              onChange={(e) => setConfig({ ...config, refreshIntervalSec: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10s (Fast)</span>
              <span>15s (LTA Standard)</span>
              <span>60s (Battery Saver)</span>
            </div>
          </div>

          {/* Backend Implementation Reference Guide */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-xs">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Backend Developer Quick-Start</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Proxy Snippet'}</span>
              </button>
            </div>

            <p className="text-slate-500 leading-relaxed text-[11px]">
              When you are ready to connect your backend, provide an endpoint that forwards requests to LTA DataMall v3:
            </p>

            <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800">
              {sampleExpressCode}
            </pre>

            <div className="text-[11px] text-slate-500 space-y-1">
              <p>• <strong>LTA Official API:</strong> <code className="text-slate-700 dark:text-slate-300">https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2</code></p>
              <p>• <strong>Auth Header:</strong> <code className="text-slate-700 dark:text-slate-300">AccountKey: YOUR_LTA_KEY</code></p>
              <p>• <strong>Parameters:</strong> <code className="text-slate-700 dark:text-slate-300">BusStopCode</code> (e.g. 01012), optional <code className="text-slate-700 dark:text-slate-300">ServiceNo</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
