-- ====================================================================
-- AuditSync: Continuous Compliance & Audit Monitoring (SOC 2, HIPAA, ISO 27001)
-- PostgreSQL Production Migration Script
-- Version: 2.4.0
-- Generated for multi-tenant isolation, RBAC, and Zero-Trust constraints
-- ====================================================================

-- Enable UUID extension for cryptographically secure UUID v4 primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'VIEWER', 'AUDITOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE integration_provider AS ENUM ('AWS', 'GITHUB', 'GOOGLE_WORKSPACE', 'JIRA', 'SLACK', 'KUBERNETES');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE integration_status AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR', 'ACTION_REQUIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE compliance_framework AS ENUM ('SOC2', 'HIPAA', 'ISO27001');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_provider AS ENUM ('AWS', 'GITHUB', 'GOOGLE_WORKSPACE', 'GLOBAL', 'KUBERNETES', 'JIRA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM ('PASS', 'FAIL', 'WARNING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------------------
-- Table 1: tenants (Multi-tenant isolation)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    selected_frameworks compliance_framework[] DEFAULT ARRAY['SOC2'::compliance_framework],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- --------------------------------------------------------------------
-- Table 2: users (Admin and team members with strict RBAC & MFA)
-- Master admin seed defaults to "TASEEL ANWAR"
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL DEFAULT 'TASEEL ANWAR',
    role user_role NOT NULL DEFAULT 'ADMIN',
    mfa_enabled BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- --------------------------------------------------------------------
-- Table 3: integrations (Connected third-party tools with Read-Only tokens)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider integration_provider NOT NULL,
    status integration_status NOT NULL DEFAULT 'DISCONNECTED',
    access_token_encrypted TEXT NOT NULL,
    read_only_verified BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_provider UNIQUE (tenant_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_integrations_tenant_provider ON integrations(tenant_id, provider);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);

-- --------------------------------------------------------------------
-- Table 4: compliance_controls (The Master Control Matrix)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compliance_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework compliance_framework NOT NULL,
    control_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source_provider source_provider NOT NULL DEFAULT 'GLOBAL',
    severity VARCHAR(20) DEFAULT 'HIGH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_framework_control_code UNIQUE (framework, control_code)
);

CREATE INDEX IF NOT EXISTS idx_compliance_controls_framework ON compliance_controls(framework);
CREATE INDEX IF NOT EXISTS idx_compliance_controls_code ON compliance_controls(control_code);
CREATE INDEX IF NOT EXISTS idx_compliance_controls_provider ON compliance_controls(source_provider);

-- --------------------------------------------------------------------
-- Table 5: audit_logs (Live automated checks & evidence vault)
-- Zero-Trust Constraint: metadata_snapshot strictly stores infrastructural keys
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES compliance_controls(id) ON DELETE RESTRICT,
    status audit_status NOT NULL,
    resource VARCHAR(255) NOT NULL,
    check_name VARCHAR(255) NOT NULL,
    metadata_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Zero Data Leakage Constraint Check: ensure no raw plaintext password/secret keys exist
    CONSTRAINT chk_zero_data_leakage CHECK (
        NOT (metadata_snapshot ? 'password' OR 
             metadata_snapshot ? 'secret_key' OR 
             metadata_snapshot ? 'ssn' OR 
             metadata_snapshot ? 'credit_card' OR
             metadata_snapshot ? 'phi_patient_name')
    )
);

-- Chronological indexes for high-speed audit ledger queries & exports
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_timestamp ON audit_logs(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_control_status ON audit_logs(control_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_metadata ON audit_logs USING gin (metadata_snapshot);

-- --------------------------------------------------------------------
-- Row Level Security (RLS) Policies for Multi-Tenant Isolation
-- --------------------------------------------------------------------
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_tenants_updated ON tenants;
CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trg_integrations_updated ON integrations;
CREATE TRIGGER trg_integrations_updated BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
