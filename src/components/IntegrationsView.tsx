import React, { useState } from 'react';
import {
  Cloud,
  Code,
  Briefcase,
  Layers,
  MessageSquare,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  X,
  Lock,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Zap,
  Check
} from 'lucide-react';
import { Integration, IntegrationProvider } from '../types';

interface IntegrationsViewProps {
  integrations: Integration[];
  onConnect: (provider: IntegrationProvider, token: string) => Promise<void>;
  onDisconnect: (provider: IntegrationProvider) => Promise<void>;
  onTriggerScan: () => void;
  isScanning: boolean;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  integrations,
  onConnect,
  onDisconnect,
  onTriggerScan,
  isScanning,
}) => {
  const [activeTab, setActiveTab] = useState<'connected' | 'available'>('connected');
  const [connectingProvider, setConnectingProvider] = useState<IntegrationProvider | null>(null);
  const [readOnlyToken, setReadOnlyToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managingIntegration, setManagingIntegration] = useState<Integration | null>(null);

  const providersConfig: {
    provider: IntegrationProvider;
    name: string;
    description: string;
    icon: any;
    color: string;
    tokenPlaceholder: string;
    tokenHelp: string;
  }[] = [
    {
      provider: 'AWS',
      name: 'AWS Cloud',
      description: 'Infrastructure security group and S3 zero-trust encryption audits.',
      icon: Cloud,
      color: 'text-amber-600 bg-amber-50',
      tokenPlaceholder: 'arn:aws:iam::123456789012:role/AuditSyncReadOnlyRole',
      tokenHelp: 'Provide IAM Role ARN with SecurityAudit and ReadOnlyAccess policies.',
    },
    {
      provider: 'GITHUB',
      name: 'GitHub',
      description: 'Commit signing, branch protection, and repository access monitor.',
      icon: Code,
      color: 'text-slate-900 bg-slate-100',
      tokenPlaceholder: 'ghp_read_only_access_token...',
      tokenHelp: 'Personal Access Token with read:org and repo:status scopes only.',
    },
    {
      provider: 'KUBERNETES',
      name: 'Kubernetes',
      description: 'Container security daemonset and pod specification vulnerability checker.',
      icon: Terminal,
      color: 'text-blue-600 bg-blue-50',
      tokenPlaceholder: 'k8s_service_account_token_readonly...',
      tokenHelp: 'Kubeconfig bearer token mapped to cluster-reader role.',
    },
    {
      provider: 'GOOGLE_WORKSPACE',
      name: 'Google Workspace',
      description: 'Identity and access management for employee lifecycle onboarding.',
      icon: Briefcase,
      color: 'text-emerald-600 bg-emerald-50',
      tokenPlaceholder: 'service_account_readonly_client_id...',
      tokenHelp: 'Domain-Wide Delegation client configured for Directory API read-only.',
    },
    {
      provider: 'JIRA',
      name: 'Jira Software',
      description: 'Compliance ticketing integration linking detected gaps to remediation tickets.',
      icon: Layers,
      color: 'text-sky-600 bg-sky-50',
      tokenPlaceholder: 'jira_api_token_read_only...',
      tokenHelp: 'Atlassian API token with read-only project tracking permissions.',
    },
    {
      provider: 'SLACK',
      name: 'Slack Alerts',
      description: 'Automated real-time notifications for critical compliance regressions.',
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-50',
      tokenPlaceholder: 'xoxb-read-and-post-compliance-alerts...',
      tokenHelp: 'Slack Bot token with incoming-webhook scopes.',
    },
  ];

  const connectedProviders = integrations.map((i) => i.provider);
  const availableProviders = providersConfig.filter(
    (p) => !connectedProviders.includes(p.provider)
  );

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingProvider || !readOnlyToken.trim()) return;

    setIsSubmitting(true);
    try {
      await onConnect(connectingProvider, readOnlyToken);
      setConnectingProvider(null);
      setReadOnlyToken('');
      setActiveTab('connected');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (provider: IntegrationProvider) => {
    if (confirm(`Disconnect ${provider}? This will stop automated monitoring.`)) {
      await onDisconnect(provider);
      setManagingIntegration(null);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Header with Quick Scan Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Integrations & Alerts</h2>
          <p className="text-[11px] text-slate-500">Zero-trust read-only collectors</p>
        </div>

        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Syncing...' : 'Sync All'}</span>
        </button>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('connected')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'connected'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Connected ({integrations.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'available'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Available ({availableProviders.length})
        </button>
      </div>

      {/* Connected Integrations List */}
      {activeTab === 'connected' && (
        <div className="space-y-2.5">
          {integrations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">No active integrations</div>
              <div className="text-xs text-slate-500 mt-1 mb-3">Connect cloud providers to enable continuous compliance</div>
              <button
                onClick={() => setActiveTab('available')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Providers
              </button>
            </div>
          ) : (
            integrations.map((int) => {
              const cfg = providersConfig.find((p) => p.provider === int.provider);
              const Icon = cfg?.icon || Cloud;
              const isHealthy = int.status === 'CONNECTED';
              const isWarning = int.provider === 'KUBERNETES';

              return (
                <div
                  key={int.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-3.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          cfg?.color || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {cfg?.name || int.provider}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Read-Only Policy Enforced
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isWarning
                          ? 'bg-amber-100 text-amber-800'
                          : isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isWarning ? 'bg-amber-500' : isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {isWarning ? '1 Warning' : isHealthy ? 'Healthy' : 'Disconnected'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {cfg?.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Sync: {new Date(int.last_synced_at).toLocaleTimeString()}
                    </span>

                    <button
                      onClick={() => setManagingIntegration(int)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
                    >
                      <span>Settings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Available Integrations List */}
      {activeTab === 'available' && (
        <div className="space-y-2.5">
          {availableProviders.map((prov) => {
            const Icon = prov.icon;
            return (
              <div
                key={prov.provider}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${prov.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{prov.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{prov.description}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConnectingProvider(prov.provider);
                    setReadOnlyToken('');
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Modal / Bottom Sheet */}
      {connectingProvider && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Connect {providersConfig.find((p) => p.provider === connectingProvider)?.name}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Zero-Trust Read-Only Credential Setup
                </p>
              </div>
              <button
                onClick={() => setConnectingProvider(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Read-Only Token / IAM Role ARN
                </label>
                <input
                  type="text"
                  required
                  value={readOnlyToken}
                  onChange={(e) => setReadOnlyToken(e.target.value)}
                  placeholder={
                    providersConfig.find((p) => p.provider === connectingProvider)?.tokenPlaceholder
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {providersConfig.find((p) => p.provider === connectingProvider)?.tokenHelp}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-800 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  AuditSync strictly prevents write or execute calls. Credential is cryptographically hashed at rest.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying...' : 'Authorize & Connect'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConnectingProvider(null)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Integration Bottom Sheet */}
      {managingIntegration && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {managingIntegration.provider} Settings
                </h3>
                <p className="text-[10px] text-slate-500">Live collector configuration</p>
              </div>
              <button
                onClick={() => setManagingIntegration(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Last Synced</span>
                <span className="font-mono text-slate-700">
                  {new Date(managingIntegration.last_synced_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Zero-Trust Mode</span>
                <span className="font-semibold text-slate-900">Read-Only Guardrails</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDisconnect(managingIntegration.provider)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Disconnect Provider
              </button>
              <button
                onClick={() => setManagingIntegration(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
