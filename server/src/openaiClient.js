import OpenAI from 'openai'
import { config } from './config.js'
import { buildSystemPrompt } from './knowledge.js'

const client = new OpenAI({ apiKey: config.openaiApiKey })

// Run one chat turn against OpenAI.
//   history: [{ role: 'user' | 'assistant', content: string }, ...]
//   language: 'en' | 'nl' | 'hr' | 'pl'
//   trainingDocs: [{ title, content }] — extra admin-managed knowledge
// Returns the assistant's reply text.
export async function getChatReply(history, language = 'en', trainingDocs = []) {
  // Keep only the most recent turns to bound token usage.
  const trimmed = history.slice(-config.maxHistoryMessages)

  let system = buildSystemPrompt(language)
  if (trainingDocs.length) {
    const extra = trainingDocs
      .map((d) => `• ${d.title}\n${d.content}`)
      .join('\n\n')
    system += `\n\nADDITIONAL KNOWLEDGE (added by Bellamar staff — treat as authoritative):\n${extra}`
  }

  const messages = [
    { role: 'system', content: system },
    ...trimmed.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    })),
  ]

  const completion = await client.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    messages,
  })

  return completion.choices?.[0]?.message?.content?.trim() || ''
}
