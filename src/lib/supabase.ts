import { createClient } from "@supabase/supabase-js"

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = {
  from: (table: string) => getClient().from(table),
}

export async function saveKnowledgeNode(node: {
  id: string
  type: string
  label: string
  metadata: Record<string, unknown>
  connections: string[]
}) {
  const { data, error } = await supabase
    .from("knowledge_nodes")
    .upsert(node, { onConflict: "id" })
  if (error) console.error("Supabase error:", error)
  return data
}

export async function getKnowledgeGraph() {
  const { data } = await supabase
    .from("knowledge_nodes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)
  return data || []
}

export async function saveDailyReport(report: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("daily_reports")
    .insert(report)
  if (error) console.error("Supabase error:", error)
  return data
}

export async function getDailyReports(limit = 7) {
  const { data } = await supabase
    .from("daily_reports")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit)
  return data || []
}
