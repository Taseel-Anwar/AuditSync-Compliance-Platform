import React, { useState, useEffect } from 'react';
import {
  Users,
  User as UserIcon,
  CreditCard,
  Send,
  Search,
  Shield,
  FileCheck,
  Download,
  Copy,
  Check,
  Lock,
  KeyRound,
  ChevronRight,
  Plus,
  Sparkles,
  Database
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SettingsViewProps {
  users: User[];
  onInviteMember: (email: string, role: UserRole) => Promise<void>;
  onExportLog: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  users,
  onInviteMember,
  onExportLog,
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'security' | 'billing' | 'schema'>('team');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('VIEWER');
  const [isSending, setIsSending] = useState(false);
  const [schemaSql, setSchemaSql] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/schema/sql')
      .then((res) => res.text())
      .then((data) => setSchemaSql(data))
      .catch(() => setSchemaSql('-- SQL Migration file is located at /server/schema.sql'));
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsSending(true);
    try {
      await onInviteMember(inviteEmail, inviteRole);
      setInviteEmail('');
      alert(`Invitation sent to ${inviteEmail}!`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([schemaSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AuditSync_Schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Organization Settings</h2>
          <p className="text-[11px] text-slate-500">Acme Corp Security & Access</p>
        </div>

        <button
          onClick={onExportLog}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'team'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Team
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'security'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'billing'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Billing
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'schema'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Schema
        </button>
      </div>

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-3">
          {/* Quick Invite Form */}
          <form
            onSubmit={handleInviteSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2.5"
          >
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Invite Team Member</span>
              <span className="text-[10px] text-slate-400 font-normal">RBAC Protected</span>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
              >
                <option value="VIEWER">Viewer</option>
                <option value="AUDITOR">Auditor</option>
                <option value="SECURITY_ENGINEER">Engineer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Inviting...' : 'Send Invitation'}</span>
            </button>
          </form>

          {/* Members List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-900 mb-1">
              Active Members ({users.length})
            </div>

            <div className="divide-y divide-slate-100">
              {users.map((u) => {
                const isUserAdmin = u.role === 'ADMIN';
                const isAuditor = u.role === 'AUDITOR';

                return (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {u.full_name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isUserAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : isAuditor
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Security & Authentication</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Strict MFA & RBAC Enforcement</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">Two-Factor Authentication</div>
                <div className="text-[10px] text-slate-500">Enforce TOTP authenticator app</div>
              </div>
            </div>

            <button
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                mfaEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Trust Architecture Active</span>
            </div>
            <p className="text-[10px] text-emerald-700 leading-relaxed">
              All cloud credentials use read-only IAM scopes with SHA-256 encrypted storage. No customer PII or raw secrets are retained.
            </p>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Active Plan
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Enterprise Continuous</h3>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-slate-900">$799</div>
              <div className="text-[10px] text-slate-400">/ month</div>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Seats</span>
              <span className="font-semibold text-slate-900">{users.length} of 10 Used</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Connected Collectors</span>
              <span className="font-semibold text-slate-900">3 of Unlimited</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next Invoice</span>
              <span className="font-semibold text-slate-900">Nov 1, 2026</span>
            </div>
          </div>

          <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors">
            Manage Billing & Payment Methods
          </button>
        </div>
      )}

      {/* Schema Tab */}
      {activeTab === 'schema' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900">PostgreSQL DDL Schema</h3>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopySql}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadSql}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>SQL</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
            {schemaSql.slice(0, 1200)}...
          </pre>
        </div>
      )}
    </div>
  );
};
