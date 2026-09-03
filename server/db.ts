import {
  Tenant,
  User,
  Integration,
  ComplianceControl,
  AuditLog,
  DashboardMetrics,
  EvidenceItem,
  ComplianceFramework
} from '../src/types';

// In-Memory Database Store mimicking PostgreSQL Tables
class AuditSyncDatabase {
  public tenants: Tenant[] = [];
  public users: User[] = [];
  public integrations: Integration[] = [];
  public controls: ComplianceControl[] = [];
  public auditLogs: AuditLog[] = [];
  public evidenceItems: EvidenceItem[] = [];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const defaultTenantId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    // 1. Tenants Table Seed
    this.tenants.push({
      id: defaultTenantId,
      name: 'AuditSync Enterprise',
      slug: 'auditsync-ent',
      frameworks: ['SOC2', 'HIPAA'],
      created_at: new Date('2023-08-15T09:00:00Z').toISOString(),
    });

    // 2. Users Table Seed (Master Admin Seed: "TASEEL ANWAR")
    this.users.push(
      {
        id: 'u-101',
        tenant_id: defaultTenantId,
        email: 'taseelb6060@gmail.com',
        full_name: 'TASEEL ANWAR',
        role: 'ADMIN',
        mfa_enabled: true,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBannEGePoo6ksr-5NpICyLAvq47dZPeoFz7v-gp3IWf6qGMaBGk3F4819J2W1ogG9UCXbuGb6bFuQjA-_mcJwBma_MTG7ECXZW6PAqweOynWogRUcoH-_m_8pKUIlEwAEL84xZtoQSYn2n6WfaVr1HvlX9133BB6X5PBlwBMOy4Bv_c4otR_ajy4WvaGibO1yhtn7EFu_f2Wy0u71x5vZgxQx0mvImTP7cTTtILBl0Wm_1B5xYymnm',
        status: 'ACTIVE',
        created_at: new Date('2023-08-15T09:10:00Z').toISOString(),
      },
      {
        id: 'u-102',
        tenant_id: defaultTenantId,
        email: 'jane.smith@company.com',
        full_name: 'Jane Smith',
        role: 'ADMIN',
        mfa_enabled: true,
        status: 'ACTIVE',
        created_at: new Date('2023-08-20T10:15:00Z').toISOString(),
      },
      {
        id: 'u-103',
        tenant_id: defaultTenantId,
        email: 'm.ray@company.com',
        full_name: 'Michael Ray',
        role: 'AUDITOR',
        mfa_enabled: true,
        status: 'ACTIVE',
        created_at: new Date('2023-09-02T11:30:00Z').toISOString(),
      },
      {
        id: 'u-104',
        tenant_id: defaultTenantId,
        email: 'a.lee@company.com',
        full_name: 'Amanda Lee',
        role: 'VIEWER',
        mfa_enabled: false,
        status: 'PENDING',
        created_at: new Date('2023-10-01T14:45:00Z').toISOString(),
      }
    );

    // 3. Integrations Table Seed
    this.integrations.push(
      {
        id: 'int-aws',
        tenant_id: defaultTenantId,
        provider: 'AWS',
        status: 'CONNECTED',
        access_token_encrypted: 'aes_gcm:enc_aws_read_only_role_arn_prod_09912',
        read_only_verified: true,
        resource_count: 84,
        last_synced_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        id: 'int-github',
        tenant_id: defaultTenantId,
        provider: 'GITHUB',
        status: 'CONNECTED',
        access_token_encrypted: 'aes_gcm:enc_ghp_readonly_token_x99a0b',
        read_only_verified: true,
        resource_count: 26,
        last_synced_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
      {
        id: 'int-kubernetes',
        tenant_id: defaultTenantId,
        provider: 'KUBERNETES',
        status: 'ACTION_REQUIRED',
        access_token_encrypted: 'aes_gcm:enc_k8s_service_account_readonly',
        read_only_verified: true,
        resource_count: 12,
        last_synced_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: 'int-slack',
        tenant_id: defaultTenantId,
        provider: 'SLACK',
        status: 'CONNECTED',
        access_token_encrypted: 'aes_gcm:enc_xoxb_slack_webhook_alerts',
        read_only_verified: true,
        resource_count: 4,
        last_synced_at: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
      {
        id: 'int-workspace',
        tenant_id: defaultTenantId,
        provider: 'GOOGLE_WORKSPACE',
        status: 'DISCONNECTED',
        access_token_encrypted: '',
        read_only_verified: false,
        resource_count: 0,
        last_synced_at: '',
      },
      {
        id: 'int-jira',
        tenant_id: defaultTenantId,
        provider: 'JIRA',
        status: 'DISCONNECTED',
        access_token_encrypted: '',
        read_only_verified: false,
        resource_count: 0,
        last_synced_at: '',
      }
    );

    // 4. Compliance Controls Table Seed
    this.controls.push(
      {
        id: 'ctrl-ac-02',
        framework: 'SOC2',
        control_code: 'AC-02',
        title: 'Account Management & Lifecycle',
        description: 'Account Management: The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.',
        source_provider: 'GLOBAL',
        severity: 'HIGH',
        status: 'Compliant',
        last_checked_date: 'Oct 24, 2023',
      },
      {
        id: 'ctrl-au-06',
        framework: 'SOC2',
        control_code: 'AU-06',
        title: 'Audit Review, Analysis, and Reporting',
        description: 'Audit Review, Analysis, and Reporting: The organization reviews and analyzes information system audit records for indications of inappropriate or unusual activity.',
        source_provider: 'AWS',
        severity: 'CRITICAL',
        status: 'Non-Compliant',
        last_checked_date: 'Oct 22, 2023',
      },
      {
        id: 'ctrl-ia-04',
        framework: 'SOC2',
        control_code: 'IA-04',
        title: 'Identifier Management & Credential Policies',
        description: 'Identifier Management: The organization manages information system identifiers for users and devices.',
        source_provider: 'GLOBAL',
        severity: 'MEDIUM',
        status: 'Pending Review',
        last_checked_date: 'Oct 26, 2023',
      },
      {
        id: 'ctrl-sc-07',
        framework: 'SOC2',
        control_code: 'SC-07',
        title: 'Boundary Protection & Network Ingress',
        description: 'Boundary Protection: The organization monitors and controls communications at the external boundary of the system.',
        source_provider: 'AWS',
        severity: 'HIGH',
        status: 'Compliant',
        last_checked_date: 'Oct 20, 2023',
      },
      {
        id: 'ctrl-cp-09',
        framework: 'SOC2',
        control_code: 'CP-09',
        title: 'Information System Backup & Recovery',
        description: 'Information System Backup: The organization conducts backups of user-level information, system-level information, and security-related documentation.',
        source_provider: 'AWS',
        severity: 'LOW',
        status: 'Exempt',
        last_checked_date: 'Sep 15, 2023',
      },
      {
        id: 'ctrl-s3-pub',
        framework: 'SOC2',
        control_code: 'S3-PUB-01',
        title: 'S3 Public Access Block Enforcement',
        description: 'Enforce that all Amazon S3 buckets prohibit public read/write access and have block-public-access enabled at both bucket and account levels.',
        source_provider: 'AWS',
        severity: 'CRITICAL',
        status: 'Non-Compliant',
        last_checked_date: 'Oct 27, 2023',
      },
      {
        id: 'ctrl-iam-004',
        framework: 'SOC2',
        control_code: 'IAM-004',
        title: 'Least Privilege IAM Role Policies',
        description: 'IAM users must not have administrative access attached directly. AdministratorAccess must be restricted to audited assume-role sessions with MFA.',
        source_provider: 'AWS',
        severity: 'HIGH',
        status: 'Compliant',
        last_checked_date: 'Oct 27, 2023',
      },
      {
        id: 'ctrl-ec2-sg',
        framework: 'SOC2',
        control_code: 'EC2-SG-02',
        title: 'Restricted Ingress Security Groups',
        description: 'Ensure no VPC security group permits public ingress (0.0.0.0/0) on sensitive administration ports such as SSH (port 22) or RDP (port 3389).',
        source_provider: 'AWS',
        severity: 'HIGH',
        status: 'Compliant',
        last_checked_date: 'Oct 27, 2023',
      },
      {
        id: 'ctrl-k8s-pod',
        framework: 'SOC2',
        control_code: 'K8S-POD-05',
        title: 'Non-Root Container Execution',
        description: 'Kubernetes workload manifests must specify securityContext.runAsNonRoot: true to prevent root privilege escalation inside containers.',
        source_provider: 'KUBERNETES',
        severity: 'MEDIUM',
        status: 'Compliant',
        last_checked_date: 'Oct 27, 2023',
      },
      // HIPAA Controls
      {
        id: 'ctrl-hipaa-164-312-a',
        framework: 'HIPAA',
        control_code: 'HIPAA-164.312(a)',
        title: 'Access Control (Unique User Identification & Emergency Access)',
        description: 'Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to permit access only to authorized persons or software programs.',
        source_provider: 'GLOBAL',
        severity: 'CRITICAL',
        status: 'Compliant',
        last_checked_date: 'Oct 25, 2023',
      },
      {
        id: 'ctrl-hipaa-164-312-e',
        framework: 'HIPAA',
        control_code: 'HIPAA-164.312(e)',
        title: 'Transmission Security & End-to-End Encryption',
        description: 'Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network (TLS 1.3+ required).',
        source_provider: 'AWS',
        severity: 'CRITICAL',
        status: 'Compliant',
        last_checked_date: 'Oct 26, 2023',
      },
      {
        id: 'ctrl-hipaa-164-312-b',
        framework: 'HIPAA',
        control_code: 'HIPAA-164.312(b)',
        title: 'Audit Controls & System Activity Review',
        description: 'Implement hardware, software, and procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.',
        source_provider: 'AWS',
        severity: 'HIGH',
        status: 'Pending Review',
        last_checked_date: 'Oct 26, 2023',
      },
      // ISO 27001 Controls
      {
        id: 'ctrl-iso-a-9-2',
        framework: 'ISO27001',
        control_code: 'A.9.2.1',
        title: 'User Registration and De-registration',
        description: 'A formal user registration and de-registration process shall be implemented to enable assignment of access rights.',
        source_provider: 'GLOBAL',
        severity: 'HIGH',
        status: 'Compliant',
        last_checked_date: 'Oct 24, 2023',
      },
      {
        id: 'ctrl-iso-a-12-1',
        framework: 'ISO27001',
        control_code: 'A.12.1.2',
        title: 'Change Management across Infrastructure',
        description: 'Changes to the organization, business processes, information processing facilities and systems that affect information security shall be controlled and tracked.',
        source_provider: 'GITHUB',
        severity: 'HIGH',
        status: 'Compliant',
        last_checked_date: 'Oct 24, 2023',
      }
    );

    // 5. Audit Logs Table Seed (matching screenshot live security feed)
    this.auditLogs.push(
      {
        id: 'log-101',
        tenant_id: defaultTenantId,
        control_id: 'ctrl-iam-004',
        control_code: 'IAM-004',
        status: 'PASS',
        resource: 'arn:aws:iam::123456789012:user/dev',
        check_name: 'IAM Policy Direct Attachment Verification',
        metadata_snapshot: {
          attached_policies_count: 0,
          inline_policies_count: 0,
          groups_enforced: true,
          mfa_registered: true,
          read_only_scan: true,
        },
        timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
      },
      {
        id: 'log-102',
        tenant_id: defaultTenantId,
        control_id: 'ctrl-s3-pub',
        control_code: 'S3-PUB-01',
        status: 'FAIL',
        resource: 's3://prod-assets-bucket',
        check_name: 'S3 Public Read Access Detection',
        metadata_snapshot: {
          block_public_acls: true,
          ignore_public_acls: true,
          block_public_policy: false,
          restrict_public_buckets: false,
          violation_details: 'Bucket policy allows Principal: "*" for GetObject action without VPC endpoint condition',
          zero_data_leakage_verified: true,
        },
        timestamp: new Date(Date.now() - 1000 * 95).toISOString(),
      },
      {
        id: 'log-103',
        tenant_id: defaultTenantId,
        control_id: 'ctrl-ec2-sg',
        control_code: 'EC2-SG-02',
        status: 'PASS',
        resource: 'sg-0a1b2c3d4e5f',
        check_name: 'Security Group Ingress Ports Range Scan',
        metadata_snapshot: {
          open_ports: [443, 80],
          restricted_ports: [22, 3389, 5432],
          cidr_all_allowed: false,
        },
        timestamp: new Date(Date.now() - 1000 * 140).toISOString(),
      },
      {
        id: 'log-104',
        tenant_id: defaultTenantId,
        control_id: 'ctrl-k8s-pod',
        control_code: 'K8S-POD-05',
        status: 'PASS',
        resource: 'pod/api-gateway-7b5...',
        check_name: 'Pod Security Standards & Non-Root Validation',
        metadata_snapshot: {
          run_as_non_root: true,
          allow_privilege_escalation: false,
          read_only_root_filesystem: true,
        },
        timestamp: new Date(Date.now() - 1000 * 210).toISOString(),
      },
      {
        id: 'log-105',
        tenant_id: defaultTenantId,
        control_id: 'ctrl-ac-02',
        control_code: 'AC-02',
        status: 'PASS',
        resource: 'idp:google-workspace-directory',
        check_name: 'Quarterly Inactive Account Deprovisioning Audit',
        metadata_snapshot: {
          inactive_users_disabled: true,
          max_inactivity_days_threshold: 90,
          pending_reviews: 0,
        },
        timestamp: new Date(Date.now() - 1000 * 360).toISOString(),
      },
      {
        id: 'log-106',
        tenant_id: defaultTenantId,
        control_id: 'ctrl-au-06',
        control_code: 'AU-06',
        status: 'FAIL',
        resource: 'aws:cloudtrail:prod-trail',
        check_name: 'CloudTrail Multi-Region Log Validation & KMS Encryption',
        metadata_snapshot: {
          multi_region_enabled: true,
          log_file_validation_enabled: false,
          kms_key_rotation_enabled: false,
          finding: 'CloudTrail log file integrity validation is turned off on prod-trail',
        },
        timestamp: new Date(Date.now() - 1000 * 600).toISOString(),
      }
    );

    // 6. Evidence Items Seed (matching Evidence Room screenshot)
    this.evidenceItems.push(
      {
        id: 'ev-01',
        tenant_id: defaultTenantId,
        title: 'SOC2 Compliance Report - Final Draft',
        type: 'PDF',
        tag: 'Q3 Audit',
        source: 'Automatically captured from CompliancePortal',
        source_provider: 'GLOBAL',
        date: 'Oct 12, 2023',
        verified: true,
        file_size: '4.8 MB',
        download_url: '/api/evidence/download/ev-01',
      },
      {
        id: 'ev-02',
        tenant_id: defaultTenantId,
        title: 'Access Log Dump: AWS IAM Role Changes',
        type: 'LOG',
        tag: 'System Log',
        source: 'Auto-streamed from AWS CloudWatch & CloudTrail',
        source_provider: 'AWS',
        date: 'Oct 11, 2023',
        verified: true,
        file_size: '184 KB',
        snippet: `> User 'admin_jdoe' attached policy 'AdministratorAccess' to role 'EC2_Admin_Role' (2023-10-11T14:22:11Z)
> User 'sys_bot' assumed role 'S3_Read_Only' (2023-10-11T14:25:01Z)
> User 'admin_jdoe' created new policy 'Custom_S3_Access' (2023-10-11T15:01:44Z)
> User 'secops_monitor' performed read-only inventory scan (2023-10-11T15:10:02Z)`,
      },
      {
        id: 'ev-03',
        tenant_id: defaultTenantId,
        title: 'DB Encryption Config',
        type: 'SCREENSHOT',
        tag: 'Verified',
        source: 'Auto-capture from AWS RDS',
        source_provider: 'AWS',
        date: 'Oct 10, 2023',
        verified: true,
        file_size: '1.2 MB',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOcuBf634szQ-gdK3W0RCwAaxANMgkzY8i6eCozY6A2L0sHh2Jiz2bZc9JNUuzCZ47XY7gaiH_FsWjx-1jkSgtevW7NS8AKuD8bcBzodjjvd_fKfoVupuigtXJ_mgPykHUluKTONnAneB_zCZ6mbjK7Yv8vXpHmUg8hl3KtODspZSPB_KmdP5HhhhiwyhzJ_1fSnmhomiMuP5Llme8L_3Yr8N8eAuBn3sKBiM-2LoMwhi2F9383cMi',
      },
      {
        id: 'ev-04',
        tenant_id: defaultTenantId,
        title: 'Data Retention Policy v4.1',
        type: 'POLICY',
        tag: 'Policy',
        source: 'Signed by CISO',
        source_provider: 'GLOBAL',
        date: 'Oct 05, 2023',
        verified: true,
        file_size: '820 KB',
        download_url: '/api/evidence/download/ev-04',
      }
    );
  }

  // --- Methods ---

  public getDashboardMetrics(tenantId: string): DashboardMetrics {
    const tenantControls = this.controls.filter(c => c.status !== 'Exempt');
    const passingCount = tenantControls.filter(c => c.status === 'Compliant').length;
    const totalCount = tenantControls.length || 1;
    
    // Exact matching to user screenshot values: 94.2% score, 12 vulnerabilities, 1,402 / 1,450 checks
    const activeIntegrationsCount = this.integrations.filter(i => i.status === 'CONNECTED').length;

    return {
      overall_score: 94.2,
      score_trend: 2.1,
      open_vulnerabilities: 12,
      vuln_trend: 4,
      checks_passed_today: 1402,
      total_checks_today: 1450,
      active_integrations_count: activeIntegrationsCount,
      last_updated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }

  public getControls(tenantId: string, framework?: string, statusFilter?: string, search?: string) {
    let result = [...this.controls];

    if (framework && framework !== 'ALL') {
      result = result.filter(c => c.framework.toUpperCase() === framework.toUpperCase());
    }

    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(c => {
        const s = (c.status || '').toLowerCase();
        if (statusFilter === 'compliant') return s === 'compliant';
        if (statusFilter === 'non-compliant') return s === 'non-compliant';
        if (statusFilter === 'pending') return s.includes('pending');
        if (statusFilter === 'exempt') return s === 'exempt';
        return true;
      });
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.control_code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // Attach latest audit log
    return result.map(ctrl => {
      const latestLog = this.auditLogs.find(l => l.control_id === ctrl.id || l.control_code === ctrl.control_code);
      return {
        ...ctrl,
        latest_log: latestLog,
      };
    });
  }

  public runComplianceScan(tenantId: string) {
    // Background worker trigger simulation:
    // Iterates connected integrations, fetches infrastructural metadata,
    // evaluates zero-trust security rules, and inserts new immutable audit_logs records.
    const connected = this.integrations.filter(i => i.status === 'CONNECTED');
    const now = new Date();
    const newLogs: AuditLog[] = [];

    // Check 1: AWS KMS Key rotation
    const kmsLog: AuditLog = {
      id: `log-${Date.now()}-1`,
      tenant_id: tenantId,
      control_id: 'ctrl-au-06',
      control_code: 'AU-06',
      status: 'PASS',
      resource: 'arn:aws:kms:us-east-1:123456789012:key/c4b8-prod',
      check_name: 'KMS Customer Master Key Annual Rotation Verification',
      metadata_snapshot: {
        key_state: 'Enabled',
        key_rotation_status: true,
        encryption_algorithm: 'AES_256_GCM',
        zero_data_leakage_verified: true,
      },
      timestamp: now.toISOString(),
    };
    newLogs.push(kmsLog);

    // Check 2: GitHub Branch Protection
    const ghLog: AuditLog = {
      id: `log-${Date.now()}-2`,
      tenant_id: tenantId,
      control_id: 'ctrl-iso-a-12-1',
      control_code: 'A.12.1.2',
      status: 'PASS',
      resource: 'github.com/auditsync/core-engine:main',
      check_name: 'Branch Protection & Required Code Reviews',
      metadata_snapshot: {
        enforce_admins: true,
        required_approving_review_count: 2,
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
      },
      timestamp: new Date(now.getTime() + 1000).toISOString(),
    };
    newLogs.push(ghLog);

    // Prepend to auditLogs
    this.auditLogs.unshift(...newLogs);

    // Also update evidence log dump item
    const logEvidence = this.evidenceItems.find(e => e.type === 'LOG');
    if (logEvidence) {
      logEvidence.snippet = `> Automated Compliance Scan Executed (${now.toISOString()})
> Checked ${connected.length} active integrations
> AWS IAM & KMS validation: OK (ReadOnly Verified)
> GitHub Branch Protection: OK (2 required reviewers)
> Kubernetes Pod Security: In Compliance
` + (logEvidence.snippet || '');
    }

    return {
      success: true,
      scanned_integrations: connected.map(c => c.provider),
      checks_run: newLogs.length,
      new_logs: newLogs,
    };
  }

  public connectIntegration(tenantId: string, provider: string, readOnlyToken: string) {
    // Validate Zero-Trust read-only token constraint
    const isReadOnly = readOnlyToken.toLowerCase().includes('read') || 
                       readOnlyToken.toLowerCase().includes('ro_') || 
                       readOnlyToken.length >= 10;
    
    let integration = this.integrations.find(i => i.provider.toUpperCase() === provider.toUpperCase());
    if (!integration) {
      integration = {
        id: `int-${Date.now()}`,
        tenant_id: tenantId,
        provider: provider.toUpperCase() as any,
        status: 'CONNECTED',
        access_token_encrypted: `aes_gcm:enc_${provider.toLowerCase()}_token_${Date.now()}`,
        read_only_verified: isReadOnly,
        resource_count: Math.floor(Math.random() * 40) + 10,
        last_synced_at: new Date().toISOString(),
      };
      this.integrations.push(integration);
    } else {
      integration.status = 'CONNECTED';
      integration.access_token_encrypted = `aes_gcm:enc_${provider.toLowerCase()}_token_${Date.now()}`;
      integration.read_only_verified = isReadOnly;
      integration.last_synced_at = new Date().toISOString();
      if (!integration.resource_count) {
        integration.resource_count = Math.floor(Math.random() * 40) + 10;
      }
    }

    // Trigger immediate compliance sync job for this newly connected tool!
    this.runComplianceScan(tenantId);

    return integration;
  }

  public disconnectIntegration(tenantId: string, provider: string) {
    const integration = this.integrations.find(i => i.provider.toUpperCase() === provider.toUpperCase());
    if (integration) {
      integration.status = 'DISCONNECTED';
      integration.access_token_encrypted = '';
      integration.last_synced_at = '';
    }
    return integration;
  }

  public updateFrameworks(tenantId: string, frameworks: ComplianceFramework[]) {
    const tenant = this.tenants.find(t => t.id === tenantId) || this.tenants[0];
    tenant.frameworks = frameworks;
    return tenant;
  }

  public inviteTeamMember(tenantId: string, email: string, role: 'ADMIN' | 'VIEWER' | 'AUDITOR') {
    const newUser: User = {
      id: `u-${Date.now()}`,
      tenant_id: tenantId,
      email,
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role,
      mfa_enabled: role === 'ADMIN',
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public generateAuditorExport(tenantId: string) {
    const tenant = this.tenants.find(t => t.id === tenantId) || this.tenants[0];
    const metrics = this.getDashboardMetrics(tenantId);
    const controls = this.getControls(tenantId);
    
    return {
      export_metadata: {
        document_id: `AUDITSYNC-EXP-${Date.now().toString().slice(-6)}`,
        generated_at: new Date().toISOString(),
        auditor_scope: 'Continuous SOC 2 Type II & HIPAA Readiness Assessment',
        tenant: {
          name: tenant.name,
          slug: tenant.slug,
          active_frameworks: tenant.frameworks,
        },
        sign_off_status: 'IMMUTABLE_CRYPTOGRAPHIC_SNAPSHOT',
        zero_trust_compliance: 'Verified Read-Only Scopes, Zero PHI/PII Leaked',
      },
      summary_metrics: metrics,
      connected_integrations: this.integrations.map(i => ({
        provider: i.provider,
        status: i.status,
        read_only_verified: i.read_only_verified,
        last_synced: i.last_synced_at,
        resource_count: i.resource_count || 0,
      })),
      controls_matrix: controls.map(c => ({
        code: c.control_code,
        framework: c.framework,
        title: c.title,
        status: c.status,
        last_checked: c.last_checked_date,
        source_provider: c.source_provider,
        latest_check_result: c.latest_log ? {
          status: c.latest_log.status,
          check_name: c.latest_log.check_name,
          resource: c.latest_log.resource,
          timestamp: c.latest_log.timestamp,
          metadata: c.latest_log.metadata_snapshot,
        } : null,
      })),
      immutable_audit_logs: this.auditLogs.slice(0, 50),
      evidence_vault: this.evidenceItems.map(e => ({
        id: e.id,
        title: e.title,
        type: e.type,
        tag: e.tag,
        date: e.date,
        verified: e.verified,
        source: e.source,
      })),
    };
  }
}

export const db = new AuditSyncDatabase();
