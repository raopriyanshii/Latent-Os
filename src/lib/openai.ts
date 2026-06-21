import OpenAI from "openai"

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "placeholder",
  })
}

export async function generateAIReport(context: string): Promise<string> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are the AI brain of LATENT OS, a self-driving startup operating system.
        Generate concise, actionable insights for startup founders.
        Format responses as structured JSON when asked for reports.`,
      },
      { role: "user", content: context },
    ],
    temperature: 0.7,
  })
  return response.choices[0].message.content || ""
}

export async function runDebateAgent(
  role: "engineer" | "pm" | "designer",
  topic: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  const openai = getClient()
  const personas = {
    engineer: "You are a pragmatic senior engineer. You focus on technical feasibility, code quality, scalability, and technical debt. You push back on unrealistic timelines and scope creep.",
    pm: "You are a product manager obsessed with user value and deadlines. You balance features with business impact and always ask 'what does the user need?'",
    designer: "You are a UX designer who champions simplicity and user experience. You care deeply about accessibility, visual consistency, and reducing cognitive load.",
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: personas[role] },
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: `Respond to this topic from your perspective (2-3 sentences max): ${topic}` },
    ],
    temperature: 0.8,
    max_tokens: 150,
  })
  return response.choices[0].message.content || ""
}

export async function detectHiddenWork(activities: string[]): Promise<string[]> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You detect invisible work patterns in software teams — untracked debugging, review cycles, context switching, documentation. Return JSON array of detected patterns.",
      },
      {
        role: "user",
        content: `Analyze these activities and identify hidden/untracked work: ${activities.join(", ")}. Return JSON: [{pattern: string, estimatedHours: number, impact: string}]`,
      },
    ],
    temperature: 0.6,
    response_format: { type: "json_object" },
  })
  try {
    const parsed = JSON.parse(response.choices[0].message.content || "{}")
    return parsed.patterns || []
  } catch {
    return []
  }
}

export async function predictBottlenecks(tasks: string[], teamLoad: string): Promise<string> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a startup digital twin that predicts delays and bottlenecks before they happen. Analyze task dependencies and team capacity.",
      },
      {
        role: "user",
        content: `Tasks: ${tasks.join(", ")}. Team load: ${teamLoad}. Predict top 3 bottlenecks as JSON: {bottlenecks: [{title, severity, predictedDelay, suggestion}]}`,
      },
    ],
    temperature: 0.6,
    response_format: { type: "json_object" },
  })
  return response.choices[0].message.content || "{}"
}

export async function processNaturalLanguageCommand(command: string): Promise<{
  action: string
  target: string
  parameters: Record<string, string>
}> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You parse natural language commands for a startup OS. Return JSON with action, target, parameters.
        Possible actions: create_task, schedule_meeting, generate_report, update_sprint, query_graph, start_debate, analyze_team
        Example: "Create a task for fixing the login bug" -> {action: "create_task", target: "notion", parameters: {title: "Fix login bug", priority: "high"}}`,
      },
      { role: "user", content: command },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  })
  try {
    return JSON.parse(response.choices[0].message.content || "{}")
  } catch {
    return { action: "unknown", target: "none", parameters: {} }
  }
}

export async function transcribeMeeting(transcript: string): Promise<{
  summary: string
  actionItems: string[]
  decisions: string[]
  notionContent: string
}> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You convert meeting transcripts into structured startup intelligence. Extract summary, action items, decisions, and generate Notion-ready content.",
      },
      {
        role: "user",
        content: `Process this meeting transcript and return JSON: {summary, actionItems: string[], decisions: string[], notionContent: string}\n\n${transcript}`,
      },
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  })
  try {
    return JSON.parse(response.choices[0].message.content || "{}")
  } catch {
    return { summary: "", actionItems: [], decisions: [], notionContent: "" }
  }
}
