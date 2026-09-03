import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  FileCode2,
  Bell,
  Settings
} from 'lucide-react';

interface MobileNavProps {
  currentView: 'dashboard' | 'controls' | 'evidence' | 'integrations' | 'settings';
  setCurrentView: (view: 'dashboard' | 'controls' | 'evidence' | 'integrations' | 'settings') => void;
  alertCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  setCurrentView,
  alertCount = 1,
}) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'controls' as const,
      label: 'Audit',
      icon: ShieldCheck,
    },
    {
      id: 'evidence' as const,
      label: 'Logs',
      icon: FileCode2,
    },
    {
      id: 'integrations' as const,
      label: 'Alerts',
      icon: Bell,
      badge: alertCount > 0 ? alertCount : undefined,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 select-none pb-safe">
      <div className="flex justify-around items-center px-2 py-1.5 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* iOS-style Home Indicator Bar */}
      <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto my-1 opacity-70" />
    </nav>
  );
};
