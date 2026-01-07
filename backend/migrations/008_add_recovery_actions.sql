-- Recovery actions for infrastructure control
CREATE TABLE IF NOT EXISTS recovery_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL,
  name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('fly-api', 'github-workflow', 'gcp-api', 'ssh-command')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution log for audit trail
CREATE TABLE IF NOT EXISTS action_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES recovery_actions(id) ON DELETE CASCADE,
  triggered_by TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failure')),
  output TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_recovery_actions_service ON recovery_actions(service_id);
CREATE INDEX IF NOT EXISTS idx_action_executions_action ON action_executions(action_id);
CREATE INDEX IF NOT EXISTS idx_action_executions_started ON action_executions(started_at DESC);

-- Seed some initial recovery actions for ORCHON infrastructure
INSERT INTO recovery_actions (service_id, name, action_type, config) VALUES
  ('observatory-backend', 'Restart Backend', 'fly-api', '{"app": "observatory-backend", "action": "restart"}'),
  ('observatory-pg', 'Restart Postgres', 'fly-api', '{"app": "observatory-pg", "action": "restart"}')
ON CONFLICT DO NOTHING;
