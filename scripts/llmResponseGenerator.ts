import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { systemPromptHC, systemPromptPA } from "../prompts/systemPrompts";

export type ChatRole = "user" | "assistant";
export interface HistoryEntry {
  role: ChatRole;
  content: string;
}

const MODEL = "gemini-2.0-flash";

function getClient() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY env var");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

function buildMessages(
  persona: string,
  history: HistoryEntry[],
  question: string
): ChatCompletionMessageParam[] {
  const systemPrompt =
    persona === "Hitesh Choudhary" ? systemPromptHC : systemPromptPA;
  const msgs: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...(history.map((h) => ({
      role: h.role,
      content: h.content,
    })) as ChatCompletionMessageParam[]),
    { role: "user", content: question },
  ];
  return msgs;
}

export default async function Response_genrator(
  persona: string,
  question: string,
  history: HistoryEntry[]
) {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: buildMessages(persona, history, question),
  });
  return response.choices[0].message;
}

// Async generator yielding content deltas (string chunks)
export async function* streamResponseGenerator(
  persona: string,
  question: string,
  history: HistoryEntry[]
) {
  const client = getClient();
  const stream = await client.chat.completions.create({
    model: MODEL,
    stream: true,
    messages: buildMessages(persona, history, question),
  });
  for await (const chunk of stream as any) {
    try {
      const choice = chunk?.choices?.[0];
      // OpenAI style: choice.delta.content may be string or array of objects
      const delta = choice?.delta?.content;
      if (!delta) continue;
      if (typeof delta === "string") {
        yield delta;
      } else if (Array.isArray(delta)) {
        // Gemini might return array of content parts
        const textParts = delta
          .map((d: any) => (typeof d === "string" ? d : d?.text || ""))
          .join("");
        if (textParts) yield textParts;
      }
    } catch {
      /* swallow malformed chunk */
    }
  }
}
