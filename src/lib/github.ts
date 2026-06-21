const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || "owner/repo"

async function githubFetch(endpoint: string) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getRecentCommits(limit = 20) {
  const data = await githubFetch(`/commits?per_page=${limit}`)
  if (!data) return []
  return data.map((c: { sha: string; commit: { message: string; author: { name: string; date: string } }; author: { login: string; avatar_url: string } | null }) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split("\n")[0],
    author: c.commit.author.name,
    avatar: c.author?.avatar_url,
    date: c.commit.author.date,
    url: `https://github.com/${GITHUB_REPO}/commit/${c.sha}`,
  }))
}

export async function getOpenPRs() {
  const data = await githubFetch("/pulls?state=open&per_page=20")
  if (!data) return []
  return data.map((pr: { number: number; title: string; user: { login: string; avatar_url: string }; created_at: string; labels: Array<{ name: string }> }) => ({
    number: pr.number,
    title: pr.title,
    author: pr.user.login,
    avatar: pr.user.avatar_url,
    createdAt: pr.created_at,
    labels: pr.labels.map((l) => l.name),
  }))
}

export async function getIssues() {
  const data = await githubFetch("/issues?state=open&per_page=30")
  if (!data) return []
  return data
    .filter((i: { pull_request?: unknown }) => !i.pull_request)
    .map((i: { number: number; title: string; user: { login: string }; labels: Array<{ name: string }> }) => ({
      number: i.number,
      title: i.title,
      author: i.user.login,
      labels: i.labels.map((l) => l.name),
    }))
}

export async function getContributorStats() {
  const data = await githubFetch("/stats/contributors")
  if (!data) return []
  return data.map((c: { author: { login: string; avatar_url: string }; total: number; weeks: Array<{ a: number; d: number; c: number }> }) => ({
    login: c.author.login,
    avatar: c.author.avatar_url,
    totalCommits: c.total,
    additions: c.weeks.reduce((sum: number, w) => sum + w.a, 0),
    deletions: c.weeks.reduce((sum: number, w) => sum + w.d, 0),
  }))
}
