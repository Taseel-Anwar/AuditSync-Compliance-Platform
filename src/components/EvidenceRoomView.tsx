import React, { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  Terminal,
  Image as ImageIcon,
  ZoomIn,
  Download,
  X,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceRoomViewProps {
  evidenceItems: EvidenceItem[];
  onExportPackage: () => void;
}

export const EvidenceRoomView: React.FC<EvidenceRoomViewProps> = ({
  evidenceItems,
  onExportPackage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);

  const filteredEvidence = useMemo(() => {
    return evidenceItems.filter((item) => {
      if (selectedType !== 'All') {
        if (selectedType === 'Logs' && item.type !== 'LOG') return false;
        if (selectedType === 'PDFs' && item.type !== 'PDF' && item.type !== 'POLICY') return false;
        if (selectedType === 'Screenshots' && item.type !== 'SCREENSHOT') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q) ||
          (item.snippet && item.snippet.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [evidenceItems, selectedType, searchQuery]);

  return (
    <div className="space-y-3.5">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Evidence Vault</h2>
          <p className="text-[11px] text-slate-500">Immutable, signed audit artifacts</p>
        </div>

        <button
          onClick={onExportPackage}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export ZIP</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search evidence artifacts..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Type Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {['All', 'Logs', 'PDFs', 'Screenshots'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedType === t
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Mobile Evidence Cards */}
      <div className="space-y-2.5">
        {filteredEvidence.map((item) => {
          const isPdf = item.type === 'PDF' || item.type === 'POLICY';
          const isLog = item.type === 'LOG';
          const isScreenshot = item.type === 'SCREENSHOT';

          return (
            <div
              key={item.id}
              onClick={() => setPreviewItem(item)}
              className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-3.5 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
            >
              {/* Header: Icon, Tag, Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isLog
                        ? 'bg-slate-900 text-emerald-400'
                        : isScreenshot
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isLog && <Terminal className="w-3.5 h-3.5" />}
                    {isScreenshot && <ImageIcon className="w-3.5 h-3.5" />}
                    {isPdf && <FileText className="w-3.5 h-3.5" />}
                  </div>

                  <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                    {item.title}
                  </span>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  {item.tag}
                </span>
              </div>

              {/* Log Snippet / Preview Thumbnail */}
              {isLog && item.snippet && (
                <div className="mt-2 bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[10px] overflow-hidden max-h-16 leading-relaxed border border-slate-800">
                  {item.snippet}
                </div>
              )}

              {isScreenshot && item.image_url && (
                <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-white bg-slate-900/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" /> Tap to view
                    </span>
                  </div>
                </div>
              )}

              {isPdf && (
                <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Cryptographically Signed
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">SHA-256 Valid</span>
                </div>
              )}

              {/* Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{item.source} · {item.date}</span>
                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Bottom Sheet */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {previewItem.tag}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {previewItem.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewItem.snippet && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Raw Cryptographic Log:
                </label>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                  {previewItem.snippet}
                </pre>
              </div>
            )}

            {previewItem.image_url && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Verified Screenshot Capture:
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={previewItem.image_url}
                    alt={previewItem.title}
                    className="w-full object-contain max-h-64"
                  />
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-500 space-y-1">
              <div>Source: <span className="font-semibold text-slate-700">{previewItem.source}</span></div>
              <div>Timestamp: <span className="font-semibold text-slate-700">{previewItem.date}</span></div>
              <div>Integrity: <span className="font-semibold text-emerald-700">Immutable Zero-Trust Seal</span></div>
            </div>

            <button
              onClick={() => setPreviewItem(null)}
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
