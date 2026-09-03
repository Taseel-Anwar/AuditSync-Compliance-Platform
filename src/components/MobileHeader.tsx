import React, { useState } from 'react';
import {
  ShieldCheck,
  Play,
  Bell,
  ChevronDown,
  Sparkles,
  Wifi,
  Battery,
  User,
  Check
} from 'lucide-react';
import { ComplianceFramework } from '../types';

interface MobileHeaderProps {
  activeFramework: ComplianceFramework;
  setActiveFramework: (fw: ComplianceFramework) => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  alertCount: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeFramework,
  setActiveFramework,
  onTriggerScan,
  isScanning,
  onOpenSettings,
  onOpenReport,
  alertCount,
}) => {
  const [showFrameworkMenu, setShowFrameworkMenu] = useState(false);

  const frameworks: { id: ComplianceFramework; label: string; desc: string }[] = [
    { id: 'SOC2', label: 'SOC 2 Type II', desc: 'Trust Services Criteria' },
    { id: 'HIPAA', label: 'HIPAA Security', desc: 'Protected Health Info' },
    { id: 'ISO27001', label: 'ISO 27001:2022', desc: 'Information Security Mgmt' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 select-none">
      {/* Native Mobile Status Bar (9:41 AM, WiFi, Battery) */}
      <div className="flex justify-between items-center px-5 pt-2 pb-1 text-[11px] font-semibold text-slate-800 tracking-tight">
        <span>9:41</span>
        <div className="flex items-center space-x-2 text-slate-700">
          <span className="text-[10px] font-bold tracking-wider font-mono">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-mono">100%</span>
            <Battery className="w-3.5 h-3.5 fill-slate-700" />
          </div>
        </div>
      </div>

      {/* Main Mobile App Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Brand Logo & Framework Picker */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                AuditSync
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
                PRO
              </span>
            </div>

            {/* Framework Switcher Pill Dropdown */}
            <div className="relative mt-0.5">
              <button
                onClick={() => setShowFrameworkMenu(!showFrameworkMenu)}
                className="flex items-center space-x-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded-full transition-colors"
              >
                <span>{activeFramework}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFrameworkMenu ? 'rotate-180' : ''}`} />
              </button>

              {showFrameworkMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFrameworkMenu(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Framework
                    </div>
                    {frameworks.map((fw) => (
                      <button
                        key={fw.id}
                        onClick={() => {
                          setActiveFramework(fw.id);
                          setShowFrameworkMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          activeFramework === fw.id ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{fw.label}</div>
                          <div className="text-[10px] text-slate-500">{fw.desc}</div>
                        </div>
                        {activeFramework === fw.id && (
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons: Scan Now, Report Export, Profile */}
        <div className="flex items-center space-x-2">
          {/* Trigger Scan Button */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all disabled:opacity-50"
            title="Execute zero-trust compliance scan"
          >
            <Play className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">{isScanning ? 'Scanning...' : 'Scan'}</span>
          </button>

          {/* Report Button */}
          <button
            onClick={onOpenReport}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Auditor Report"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>

          {/* Profile / Settings */}
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-blue-500 transition-all"
            title="User Profile & Settings"
          >
            <User className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
