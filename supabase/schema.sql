-- LATENT OS — Supabase Schema

-- Knowledge Graph Nodes
CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('person', 'task', 'meeting', 'commit', 'decision', 'document')),
  label TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  connections TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily AI Reports
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  launch_readiness INTEGER,
  velocity INTEGER,
  wins TEXT[],
  blockers TEXT[],
  tomorrow_focus TEXT[],
  team_morale FLOAT,
  sprint_progress INTEGER,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting Records
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER,
  participants TEXT[],
  transcript TEXT,
  summary TEXT,
  action_items TEXT[],
  decisions TEXT[],
  notion_page_id TEXT,
  github_issues INTEGER[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Member Snapshots
CREATE TABLE IF NOT EXISTS team_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  role TEXT,
  commits INTEGER DEFAULT 0,
  hidden_work_hours FLOAT DEFAULT 0,
  dna_focus INTEGER,
  dna_collaboration INTEGER,
  dna_innovation INTEGER,
  dna_execution INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bottleneck Predictions
CREATE TABLE IF NOT EXISTS bottleneck_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  affected_tasks TEXT[],
  predicted_delay INTEGER,
  probability INTEGER,
  suggestion TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottleneck_predictions ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public read" ON knowledge_nodes FOR SELECT USING (true);
CREATE POLICY "Public insert" ON knowledge_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public upsert" ON knowledge_nodes FOR UPDATE USING (true);
CREATE POLICY "Public read" ON daily_reports FOR SELECT USING (true);
CREATE POLICY "Public insert" ON daily_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public insert" ON meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON team_snapshots FOR SELECT USING (true);
CREATE POLICY "Public insert" ON team_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON bottleneck_predictions FOR SELECT USING (true);
CREATE POLICY "Public insert" ON bottleneck_predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON bottleneck_predictions FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_type ON knowledge_nodes(type);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date DESC);
CREATE INDEX IF NOT EXISTS idx_team_snapshots_date ON team_snapshots(date DESC);
