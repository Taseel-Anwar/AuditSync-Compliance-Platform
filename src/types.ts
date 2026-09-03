export type UserRole = 'ADMIN' | 'VIEWER' | 'AUDITOR';

export type IntegrationProvider = 'AWS' | 'GITHUB' | 'GOOGLE_WORKSPACE' | 'JIRA' | 'SLACK' | 'KUBERNETES';

export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'ACTION_REQUIRED';

export type ComplianceFramework = 'SOC2' | 'HIPAA' | 'ISO27001';

export type SourceProvider = 'AWS' | 'GITHUB' | 'GOOGLE_WORKSPACE' | 'GLOBAL' | 'KUBERNETES' | 'JIRA';

export type AuditStatus = 'PASS' | 'FAIL' | 'WARNING';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  frameworks: ComplianceFramework[];
  created_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  mfa_enabled: boolean;
  avatar_url?: string;
  status: 'ACTIVE' | 'PENDING';
  created_at: string;
}

export interface Integration {
  id: string;
  tenant_id: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  access_token_encrypted: string;
  read_only_verified: boolean;
  resource_count?: number;
  last_synced_at: string;
}

export interface ComplianceControl {
  id: string;
  framework: ComplianceFramework;
  control_code: string;
  title: string;
  description: string;
  source_provider: SourceProvider;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'Exempt';
  last_checked_date?: string;
  latest_log?: AuditLog;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  control_id: string;
  control_code?: string;
  status: AuditStatus;
  resource: string;
  check_name: string;
  metadata_snapshot: Record<string, any>;
  timestamp: string;
}

export interface DashboardMetrics {
  overall_score: number;
  score_trend: number;
  open_vulnerabilities: number;
  vuln_trend: number;
  checks_passed_today: number;
  total_checks_today: number;
  active_integrations_count: number;
  last_updated: string;
}

export interface EvidenceItem {
  id: string;
  tenant_id: string;
  title: string;
  type: 'PDF' | 'LOG' | 'SCREENSHOT' | 'POLICY';
  tag: string;
  source: string;
  source_provider: SourceProvider;
  date: string;
  verified: boolean;
  file_size?: string;
  snippet?: string;
  image_url?: string;
  download_url?: string;
}
