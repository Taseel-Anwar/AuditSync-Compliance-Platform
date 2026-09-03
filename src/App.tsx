import React, { useState, useEffect, useCallback } from 'react';
import { MobileHeader } from './components/MobileHeader';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './components/DashboardView';
import { ControlsView } from './components/ControlsView';
import { EvidenceRoomView } from './components/EvidenceRoomView';
import { IntegrationsView } from './components/IntegrationsView';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ReportModal } from './components/ReportModal';
import {
  DashboardMetrics,
  Integration,
  ComplianceControl,
  AuditLog,
  EvidenceItem,
  User,
  ComplianceFramework,
  IntegrationProvider,
  UserRole,
} from './types';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  LogIn,
  Compass,
  Play,
  FileDown
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'controls' | 'evidence' | 'integrations' | 'settings'
  >('dashboard');
  const [activeFramework, setActiveFramework] = useState<ComplianceFramework>('SOC2');

  // Preview Mode: 'frame' shows phone frame on desktop; 'fluid' expands full width
  const [previewMode, setPreviewMode] = useState<'frame' | 'fluid'>('frame');

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    overall_score: 94.2,
    score_trend: 2.1,
    open_vulnerabilities: 12,
    vuln_trend: 4,
    checks_passed_today: 1402,
    total_checks_today: 1450,
  });

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from backend API
  const loadData = useCallback(async () => {
    try {
      const [metricsRes, intRes, ctrlRes, logsRes, evidRes, usersRes] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/integrations'),
        fetch('/api/controls'),
        fetch('/api/audit-logs'),
        fetch('/api/evidence'),
        fetch('/api/users'),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (intRes.ok) setIntegrations(await intRes.json());
      if (ctrlRes.ok) setControls(await ctrlRes.json());
      if (logsRes.ok) setAuditLogs(await logsRes.json());
      if (evidRes.ok) setEvidenceItems(await evidRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error('Error fetching data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle running zero-trust compliance scan
  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      await fetch('/api/jobs/run-compliance-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: 'default' }),
      });
      await loadData();
    } catch (err) {
      console.error('Error running scan:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Connect integration
  const handleConnectIntegration = async (provider: IntegrationProvider, token: string) => {
    try {
      const res = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          auth_token: token,
          config: { read_only: true },
        }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  // Disconnect integration
  const handleDisconnectIntegration = async (provider: IntegrationProvider) => {
    try {
      const res = await fetch('/api/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  // Invite team member
  const handleInviteMember = async (email: string, role: UserRole) => {
    const res = await fetch('/api/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (res.ok) {
      await loadData();
    }
  };

  // Count active warnings or alerts for badge
  const warningCount = integrations.filter((i) => i.provider === 'KUBERNETES').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Desktop Simulation Toolbar: Helps test and switch screens on desktop browser */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white">AuditSync Mobile App</span>
          <span className="text-slate-500 font-mono">|</span>
          <span className="text-slate-400">SOC 2 / HIPAA Continuous Compliance</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Fast Screen Switchers for Testing */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <LogIn className="w-3 h-3" />
            <span>Sign In View</span>
          </button>

          <button
            onClick={() => setShowOnboardingModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Compass className="w-3 h-3" />
            <span>Onboarding Flow</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <FileDown className="w-3 h-3" />
            <span>Auditor Export</span>
          </button>

          {/* Toggle Device Frame vs Fluid Mode */}
          <button
            onClick={() => setPreviewMode(previewMode === 'frame' ? 'fluid' : 'frame')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
            title="Toggle Smartphone device frame"
          >
            {previewMode === 'frame' ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>Fluid Mobile</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>Device Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {/* Smartphone Device Shell */}
        <div
          className={`w-full bg-[#F8FAFC] flex flex-col relative transition-all duration-300 ${
            previewMode === 'frame'
              ? 'sm:max-w-[420px] sm:min-h-[844px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:overflow-hidden ring-1 ring-slate-700/50'
              : 'max-w-md min-h-screen sm:border-x sm:border-slate-200'
          }`}
        >
          {/* Dynamic Island Notch (visible in frame mode on desktop) */}
          {previewMode === 'frame' && (
            <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 pointer-events-none" />
          )}

          {/* Mobile Top App Header */}
          <MobileHeader
            activeFramework={activeFramework}
            setActiveFramework={setActiveFramework}
            onTriggerScan={handleTriggerScan}
            isScanning={isScanning}
            onOpenSettings={() => setCurrentView('settings')}
            onOpenReport={() => setShowReportModal(true)}
            alertCount={warningCount}
          />

          {/* Scrollable Mobile App Body */}
          <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-6">
            {currentView === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                integrations={integrations}
                auditLogs={auditLogs}
                onNavigateToIntegrations={() => setCurrentView('integrations')}
                onNavigateToControls={() => setCurrentView('controls')}
              />
            )}

            {currentView === 'controls' && (
              <ControlsView
                controls={controls}
                activeFramework={activeFramework}
                setActiveFramework={setActiveFramework}
                onRefreshControls={loadData}
              />
            )}

            {currentView === 'evidence' && (
              <EvidenceRoomView
                evidenceItems={evidenceItems}
                onExportPackage={() => setShowReportModal(true)}
              />
            )}

            {currentView === 'integrations' && (
              <IntegrationsView
                integrations={integrations}
                onConnect={handleConnectIntegration}
                onDisconnect={handleDisconnectIntegration}
                onTriggerScan={handleTriggerScan}
                isScanning={isScanning}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                users={users}
                onInviteMember={handleInviteMember}
                onExportLog={() => setShowReportModal(true)}
              />
            )}
          </main>

          {/* Mobile Bottom Navigation Bar (Sticky at bottom of app shell) */}
          <MobileNav
            currentView={currentView}
            setCurrentView={setCurrentView}
            alertCount={warningCount}
          />
        </div>
      </div>

      {/* Mobile Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(email) => {
          console.log('Logged in as:', email);
        }}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onFrameworkSelected={(fw) => {
          setActiveFramework(fw);
          setCurrentView('controls');
        }}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        metrics={metrics}
        activeFramework={activeFramework}
      />
    </div>
  );
}
