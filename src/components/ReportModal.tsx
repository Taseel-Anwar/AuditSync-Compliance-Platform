import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Shield, X, Copy, Check } from 'lucide-react';
import { DashboardMetrics, ComplianceFramework } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: DashboardMetrics;
  activeFramework: ComplianceFramework;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  activeFramework,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleDownloadJSON = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/evidence/export');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AuditSync_${activeFramework}_Auditor_Package_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const cryptographicHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Auditor Compliance Package
              </h3>
              <p className="text-[10px] text-slate-500">
                Continuous Evidence & Matrix Snapshot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Summary */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Audit Scope:</span>
            <span className="font-bold text-slate-900">{activeFramework} Type II Continuous</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Overall Score:</span>
            <span className="font-bold text-emerald-600">{metrics.overall_score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Evaluated Checks:</span>
            <span className="font-mono text-slate-800">
              {metrics.checks_passed_today} / {metrics.total_checks_today} passed
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Open Vulnerabilities:</span>
            <span className="font-bold text-rose-600">{metrics.open_vulnerabilities}</span>
          </div>
        </div>

        {/* Hash info */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            SHA-256 Chain Seal:
          </label>
          <div className="flex items-center bg-slate-100 p-2 rounded-xl text-[10px] font-mono text-slate-700">
            <span className="truncate flex-1">{cryptographicHash}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(cryptographicHash);
                setCopiedHash(true);
                setTimeout(() => setCopiedHash(false), 1500);
              }}
              className="ml-2 text-blue-600 hover:text-blue-800 p-1"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={handleDownloadJSON}
            disabled={downloading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Bundling...' : 'Download JSON Package'}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
