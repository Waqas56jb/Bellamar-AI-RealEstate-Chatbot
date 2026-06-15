import OpenAI from 'openai'
import { config } from './config.js'
import { buildSystemPrompt } from './knowledge.js'

const client = new OpenAI({ apiKey: config.openaiApiKey })

// Build the OpenAI message array (system prompt + admin training + history).
function buildMessages(history, language, trainingDocs) {
  const trimmed = history.slice(-config.maxHistoryMessages)

  let system = buildSystemPrompt(language)
  if (trainingDocs.length) {
    const extra = trainingDocs.map((d) => `• ${d.title}\n${d.content}`).join('\n\n')
    system += `\n\nADDITIONAL KNOWLEDGE (added by Bellamar staff — treat as authoritative):\n${extra}`
  }

  return [
    { role: 'system', content: system },
    ...trimmed.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    })),
  ]
}

// Non-streaming reply (kept as a fallback).
export async function getChatReply(history, language = 'en', trainingDocs = []) {
  const completion = await client.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    messages: buildMessages(history, language, trainingDocs),
  })
  return completion.choices?.[0]?.message?.content?.trim() || ''
}

// Streaming reply: calls `onDelta(text)` for each token chunk, returns the full text.
export async function streamChatReply(history, language = 'en', trainingDocs = [], onDelta) {
  const stream = await client.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    stream: true,
    messages: buildMessages(history, language, trainingDocs),
  })

  let full = ''
  for await (const part of stream) {
    const delta = part.choices?.[0]?.delta?.content || ''
    if (delta) {
      full += delta
      onDelta?.(delta)
    }
  }
  return full.trim()
}
