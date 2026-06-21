import { Client } from "@notionhq/client"

export const notion = new Client({
  auth: process.env.NOTION_API_KEY || "placeholder",
})

export async function getNotionDatabase(databaseId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion as any).databases.query({
      database_id: databaseId,
      page_size: 50,
    })
    return response.results
  } catch {
    return []
  }
}

export async function createNotionPage(databaseId: string, properties: Record<string, unknown>) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties as Parameters<typeof notion.pages.create>[0]["properties"],
    })
    return response
  } catch (error) {
    console.error("Failed to create Notion page:", error)
    return null
  }
}

export async function updateNotionPage(pageId: string, properties: Record<string, unknown>) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties as Parameters<typeof notion.pages.update>[0]["properties"],
    })
    return response
  } catch (error) {
    console.error("Failed to update Notion page:", error)
    return null
  }
}

export async function getNotionPageContent(pageId: string) {
  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId })
    return blocks.results
  } catch {
    return []
  }
}

export function extractTextFromRichText(richText: Array<{ plain_text: string }>) {
  return richText.map((t) => t.plain_text).join("")
}
