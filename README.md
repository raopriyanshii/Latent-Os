# LATENT OS — The Self-Driving Startup

> **NeuroX Hackathon 2026 · Notion Track**  
> Built with Next.js 15, Notion API, OpenAI, Supabase & GitHub API

---

## What is LATENT OS?

LATENT OS is an AI-native operating system for startups, built *inside* Notion. It transforms your Notion workspace into a self-managing startup that predicts delays, surfaces hidden work, and runs on plain English commands.

Think **Cursor for startups** — but instead of autocompleting code, it autocompletes your entire company.

---

## Demo Modules

| Module | Description |
|--------|-------------|
| 🕰️ **Startup Time Machine** | Navigate your startup's complete history with AI insights |
| 🤖 **Digital Twin** | Predict bottlenecks and delays 72 hours before they happen |
| 🧬 **Team DNA Engine** | Deep personality and work pattern analysis for every team member |
| 👁️ **Invisible Work Detector** | Surface untracked hours from context switching, reviews, and debugging |
| 🎭 **AI Debate Room** | Engineer, PM, and Designer agents debate your product decisions |
| 🎙️ **Meeting → Everything** | One meeting transcript → Notion page + tasks + GitHub issues + decisions |
| ⚡ **Natural Language Command Center** | Run your entire startup from a terminal with plain English |
| 🕸️ **Knowledge Graph** | People, tasks, meetings, commits, and decisions — all connected live |
| 📊 **Daily AI Reports** | Auto-generated sprint summaries and launch readiness scores |
| 🔄 **Notion Deep Sync** | Real-time two-way sync with all your Notion databases |

---

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom dark theme
- **Components**: Radix UI primitives
- **AI**: OpenAI GPT-4o (Claude API compatible)
- **Database**: Supabase (PostgreSQL)
- **Integrations**: Notion API, GitHub API

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/raopriyanshii/latent-os.git
cd latent-os
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your API keys

# 3. Set up Supabase
# Run supabase/schema.sql in your Supabase SQL editor

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page.  
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the OS.

---

## Environment Variables

```env
NOTION_API_KEY=          # Notion integration token
OPENAI_API_KEY=          # OpenAI API key
NEXT_PUBLIC_SUPABASE_URL=     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
GITHUB_TOKEN=            # GitHub personal access token
GITHUB_REPO=             # owner/repo-name
```

---

## Notion Setup

1. Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Share these databases with your integration:
   - Sprint Tasks database
   - Team Members database
   - Decisions Log database
   - Meeting Notes database

---

## Why This Wins

### Judging Criteria Alignment

**Project Planning & Documentation (25%)**
- Auto-generated sprint summaries with AI insights
- Decision log with context and rationale
- Launch readiness scoring with component breakdown

**Team Workflow & Collaboration (35%)**
- Team DNA Engine reveals hidden patterns
- Meeting-to-Everything pipeline eliminates manual follow-up
- Invisible Work Detector surfaces untracked effort

**Innovation, Automation & Integrations (40%)**
- Digital Twin predicts problems before they happen
- AI Debate Room — first-ever multi-agent product discussion tool
- Knowledge Graph connects every signal automatically
- Plain English commands replace 10+ Notion shortcuts

---

## Architecture

```
latent-os/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/page.tsx    # Main OS dashboard
│   │   └── api/
│   │       ├── ai-report/        # Daily report generation
│   │       ├── notion/           # Notion sync endpoints
│   │       ├── github/           # GitHub integration
│   │       ├── knowledge-graph/  # Graph CRUD
│   │       ├── command/          # NL command parsing
│   │       └── debate/           # AI debate agents
│   ├── components/
│   │   ├── dashboard/            # Layout components
│   │   └── modules/              # Feature modules
│   ├── lib/
│   │   ├── notion.ts             # Notion SDK wrapper
│   │   ├── openai.ts             # AI functions
│   │   ├── github.ts             # GitHub API wrapper
│   │   └── supabase.ts           # Database client
│   └── types/                    # TypeScript definitions
└── supabase/
    └── schema.sql                # Database schema
```

---

Built with ❤️ for the NeuroX × Notion Hackathon 2026
