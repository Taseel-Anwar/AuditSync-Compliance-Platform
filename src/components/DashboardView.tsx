import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  GitBranch,
  Terminal,
  Plus,
  Activity,
  Code,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  X
} from 'lucide-react';
import { DashboardMetrics, Integration, AuditLog } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  integrations: Integration[];
  auditLogs: AuditLog[];
  onNavigateToIntegrations: () => void;
  onNavigateToControls: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  integrations,
  auditLogs,
  onNavigateToIntegrations,
  onNavigateToControls,
}) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  return (
    <div className="space-y-4">
      {/* Hero Status Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Continuous Monitoring</span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Active
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Compliance Posture</div>
            <div className="text-3xl font-extrabold tracking-tight mt-0.5">
              {metrics.overall_score}%
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-700/40">
              <TrendingUp className="w-3 h-3 mr-1" /> +{metrics.score_trend}% this week
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              {metrics.checks_passed_today.toLocaleString()} of {metrics.total_checks_today.toLocaleString()} checks pass
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${metrics.overall_score}%` }}
          />
        </div>
      </div>

      {/* 2 Quick Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Open Vulnerabilities */}
        <div
          onClick={onNavigateToControls}
          className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Vulnerabilities</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {metrics.open_vulnerabilities}
            </span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              +{metrics.vuln_trend} new
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>2 Critical gaps</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Checks Passed */}
        <div
          onClick={onNavigateToControls}
          className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pass Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {Math.round((metrics.checks_passed_today / metrics.total_checks_today) * 100)}%
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {metrics.checks_passed_today} ok
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Daily check run</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Active Integrations Horizontal Scroll / Grid */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <h2 className="text-sm font-bold text-slate-900">Active Integrations</h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              3 Active
            </span>
          </div>
          <button
            onClick={onNavigateToIntegrations}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>Manage</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* AWS */}
          <div
            onClick={onNavigateToIntegrations}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">AWS Cloud</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                Healthy
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div
            onClick={onNavigateToIntegrations}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900/10 text-slate-900 flex items-center justify-center shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">GitHub</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                Healthy
              </div>
            </div>
          </div>

          {/* Kubernetes */}
          <div
            onClick={onNavigateToIntegrations}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">Kubernetes</div>
              <div className="text-[10px] text-rose-600 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" />
                1 Warning
              </div>
            </div>
          </div>

          {/* Add Integration */}
          <div
            onClick={onNavigateToIntegrations}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center space-x-1.5 text-slate-600 hover:text-slate-900 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold">Connect New</span>
          </div>
        </div>
      </section>

      {/* Live Security Feed (Mobile Card List) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">Live Security Feed</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-500">Automated zero-trust checks</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Stream active</span>
        </div>

        {/* Mobile List Items */}
        <div className="space-y-2.5">
          {auditLogs.map((log) => {
            const isPass = log.status === 'PASS';
            const formattedTime = new Date(log.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                      {log.control_code || log.control_id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formattedTime}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isPass
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {isPass ? 'PASS' : 'FAIL'}
                  </span>
                </div>

                <div className="mt-1.5">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {log.check_name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                    {log.resource}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 text-[10px]">Zero PHI Exfiltration Verified</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-0.5 group-hover:underline">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Audit Log Mobile Inspection Bottom Sheet */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedLog.control_code || selectedLog.control_id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedLog.check_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedLog.status === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedLog.status}
                </span>
              </div>
              <div className="flex flex-col py-1 border-b border-slate-100">
                <span className="text-slate-500">Target Resource</span>
                <span className="font-mono text-slate-800 font-medium text-[11px] break-all mt-0.5">
                  {selectedLog.resource}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Execution Time</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {new Date(selectedLog.timestamp).toISOString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Zero-Leakage Metadata Payload:
              </label>
              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-40 border border-slate-800">
                {JSON.stringify(selectedLog.metadata_snapshot, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
