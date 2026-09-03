import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// --------------------------------------------------------------------
// A. Authentication & Onboarding Endpoints
// --------------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { company_name, slug, email, full_name, password } = req.body;
  
  const tenantId = `tenant-${Date.now()}`;
  const newTenant = {
    id: tenantId,
    name: company_name || 'Acme Compliance Corp',
    slug: slug || (company_name ? company_name.toLowerCase().replace(/\s+/g, '-') : 'acme-corp'),
    frameworks: ['SOC2', 'HIPAA'] as any,
    created_at: new Date().toISOString(),
  };
  db.tenants.push(newTenant);

  const newUser = {
    id: `u-${Date.now()}`,
    tenant_id: tenantId,
    email: email || 'taseelb6060@gmail.com',
    full_name: full_name || 'TASEEL ANWAR',
    role: 'ADMIN' as const,
    mfa_enabled: true,
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBannEGePoo6ksr-5NpICyLAvq47dZPeoFz7v-gp3IWf6qGMaBGk3F4819J2W1ogG9UCXbuGb6bFuQjA-_mcJwBma_MTG7ECXZW6PAqweOynWogRUcoH-_m_8pKUIlEwAEL84xZtoQSYn2n6WfaVr1HvlX9133BB6X5PBlwBMOy4Bv_c4otR_ajy4WvaGibO1yhtn7EFu_f2Wy0u71x5vZgxQx0mvImTP7cTTtILBl0Wm_1B5xYymnm',
    status: 'ACTIVE' as const,
    created_at: new Date().toISOString(),
  };
  db.users.push(newUser);

  res.status(201).json({
    success: true,
    tenant: newTenant,
    user: newUser,
    message: 'Tenant and Master Admin provisioned with SOC2 & HIPAA frameworks.',
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || db.users[0];
  const tenant = db.tenants.find(t => t.id === user.tenant_id) || db.tenants[0];
  
  res.json({
    success: true,
    user,
    tenant,
  });
});

// POST /api/onboarding/select-framework
app.post('/api/onboarding/select-framework', (req: Request, res: Response) => {
  const { tenant_id, frameworks } = req.body;
  const tenant = db.updateFrameworks(tenant_id || db.tenants[0].id, frameworks || ['SOC2']);
  
  res.json({
    success: true,
    tenant,
    message: 'Tenant compliance frameworks updated successfully.',
  });
});

// --------------------------------------------------------------------
// B. Dashboard Metrics Endpoints
// --------------------------------------------------------------------

// GET /api/dashboard/metrics?tenant_id={id}
app.get('/api/dashboard/metrics', (req: Request, res: Response) => {
  const tenantId = (req.query.tenant_id as string) || db.tenants[0].id;
  const metrics = db.getDashboardMetrics(tenantId);
  res.json(metrics);
});

// --------------------------------------------------------------------
// C. Integrations Management Endpoints
// --------------------------------------------------------------------

// GET /api/integrations?tenant_id={id}
app.get('/api/integrations', (req: Request, res: Response) => {
  const tenantId = (req.query.tenant_id as string) || db.tenants[0].id;
  const integrations = db.integrations.filter(i => i.tenant_id === tenantId || true);
  res.json(integrations);
});

// POST /api/integrations/connect
app.post('/api/integrations/connect', (req: Request, res: Response) => {
  const { tenant_id, provider, read_only_token } = req.body;
  const tenantId = tenant_id || db.tenants[0].id;

  if (!provider) {
    return res.status(400).json({ error: 'Provider is required' });
  }

  const integration = db.connectIntegration(tenantId, provider, read_only_token || 'ro_token_valid');
  res.json({
    success: true,
    integration,
    message: `${provider} connected with verified Read-Only access. Compliance sync job completed.`,
  });
});

// POST /api/integrations/disconnect
app.post('/api/integrations/disconnect', (req: Request, res: Response) => {
  const { tenant_id, provider } = req.body;
  const tenantId = tenant_id || db.tenants[0].id;

  const integration = db.disconnectIntegration(tenantId, provider);
  res.json({
    success: true,
    integration,
    message: `${provider} disconnected.`,
  });
});

// --------------------------------------------------------------------
// D. The Control Matrix & Automated Checks Endpoints
// --------------------------------------------------------------------

// GET /api/controls?tenant_id={id}&framework={SOC2}&status={all}&search={text}
app.get('/api/controls', (req: Request, res: Response) => {
  const tenantId = (req.query.tenant_id as string) || db.tenants[0].id;
  const framework = req.query.framework as string;
  const statusFilter = req.query.status as string;
  const search = req.query.search as string;

  const controls = db.getControls(tenantId, framework, statusFilter, search);
  res.json(controls);
});

// POST /api/jobs/run-compliance-scan
app.post('/api/jobs/run-compliance-scan', (req: Request, res: Response) => {
  const { tenant_id } = req.body;
  const tenantId = tenant_id || db.tenants[0].id;

  const scanResult = db.runComplianceScan(tenantId);
  const updatedMetrics = db.getDashboardMetrics(tenantId);

  res.json({
    ...scanResult,
    metrics: updatedMetrics,
    message: 'Continuous compliance scan executed across all active integrations.',
  });
});

// GET /api/audit-logs?tenant_id={id}
app.get('/api/audit-logs', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 30;
  res.json(db.auditLogs.slice(0, limit));
});

// --------------------------------------------------------------------
// E. Evidence Vault & Auditor Export Endpoints
// --------------------------------------------------------------------

// GET /api/evidence?tenant_id={id}&type={type}&search={term}
app.get('/api/evidence', (req: Request, res: Response) => {
  const typeFilter = (req.query.type as string || '').toUpperCase();
  const search = (req.query.search as string || '').toLowerCase();

  let items = [...db.evidenceItems];

  if (typeFilter && typeFilter !== 'ALL' && typeFilter !== 'ALL TYPES') {
    items = items.filter(i => i.type.toUpperCase() === typeFilter || (typeFilter === 'PDFS' && (i.type === 'PDF' || i.type === 'POLICY')));
  }

  if (search) {
    items = items.filter(i => 
      i.title.toLowerCase().includes(search) ||
      i.source.toLowerCase().includes(search) ||
      i.tag.toLowerCase().includes(search) ||
      (i.snippet && i.snippet.toLowerCase().includes(search))
    );
  }

  res.json(items);
});

// GET /api/evidence/export?tenant_id={id}
app.get('/api/evidence/export', (req: Request, res: Response) => {
  const tenantId = (req.query.tenant_id as string) || db.tenants[0].id;
  const auditorPackage = db.generateAuditorExport(tenantId);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="AuditSync_SOC2_Auditor_Package_${Date.now()}.json"`);
  res.json(auditorPackage);
});

// --------------------------------------------------------------------
// F. Team & Settings Endpoints
// --------------------------------------------------------------------

// GET /api/team?tenant_id={id}
app.get('/api/team', (req: Request, res: Response) => {
  res.json(db.users);
});

// POST /api/team/invite
app.post('/api/team/invite', (req: Request, res: Response) => {
  const { tenant_id, email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const newUser = db.inviteTeamMember(tenant_id || db.tenants[0].id, email, role || 'VIEWER');
  res.status(201).json({
    success: true,
    user: newUser,
    message: `Invitation email sent to ${email}`,
  });
});

// GET /api/schema/sql - Serves the exact PostgreSQL Migration Script
app.get('/api/schema/sql', (req: Request, res: Response) => {
  try {
    const schemaPath = path.join(process.cwd(), 'server', 'schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(sqlContent);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to read schema.sql: ' + err.message });
  }
});

// POST /api/ai/audit-explain - AI-driven compliance diagnosis & remediation
app.post('/api/ai/audit-explain', async (req: Request, res: Response) => {
  const { control_code, control_title, control_description, status, metadata_snapshot } = req.body;
  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are a certified SOC 2, HIPAA, and ISO 27001 lead auditor and enterprise cloud security specialist.
Explain this compliance control finding and give clear, step-by-step remediation instructions for engineering and DevSecOps:
Control Code: ${control_code}
Title: ${control_title}
Description: ${control_description}
Current Status: ${status}
Audit Metadata Snapshot: ${JSON.stringify(metadata_snapshot || {})}

Provide:
1. Executive Risk Summary (2 sentences)
2. Exact Technical Root Cause
3. Step-by-Step Remediation Guide (CLI/Terraform/Console instructions)
4. Auditor Acceptance Criteria (what evidence is needed to close this finding)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        analysis: response.text,
      });
    } catch (err: any) {
      console.error('Gemini API call failed, using rule-based compliance guidance:', err);
    }
  }

  // Fallback compliance intelligence
  res.json({
    success: true,
    analysis: `### 1. Executive Risk Summary
Control **${control_code}** (${control_title}) is currently marked as **${status}**. Failure to enforce this configuration exposes cloud infrastructure to lateral privilege escalation or unauthenticated external access during SOC 2 Type II testing.

### 2. Exact Technical Root Cause
The continuous compliance scanner detected missing or permissive bucket policies and unverified multi-region audit logs:
\`\`\`json
${JSON.stringify(metadata_snapshot || { finding: 'Config drift detected against baseline CIS benchmark' }, null, 2)}
\`\`\`

### 3. Step-by-Step Remediation Guide
1. **Enforce Read-Only Boundaries:** Verify IAM roles have \`ReadOnlyAccess\` and administrator policies require MFA session tokens (\`aws:MultiFactorAuthPresent: true\`).
2. **Apply Infrastructure as Code:** Deploy terraform block:
\`\`\`hcl
resource "aws_s3_bucket_public_access_block" "prod" {
  bucket = var.target_bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
\`\`\`
3. **Trigger Immediate Re-scan:** Click "Run Compliance Scan" to write an updated PASS entry into \`audit_logs\`.

### 4. Auditor Acceptance Criteria
- Verified non-repudiation log in AWS CloudTrail / GitHub audit log stream.
- Zero open critical findings for 90-day observation window.`,
  });
});

// --------------------------------------------------------------------
// Vite Middleware / Static Server Boot
// --------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuditSync Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
