import { NextResponse } from "next/server";
// Using relative path since tsconfig path alias might not be configured for scripts
import Response_genrator from "../../../../scripts/llmResponseGenerator";

// Type definitions
export type ChatRole = "user" | "assistant";
export interface HistoryEntry {
  role: ChatRole;
  content: string;
}
export interface IncomingHistoryEntry {
  role?: ChatRole;
  content?: string;
  text?: string;
}
export interface ChatRequestBody {
  message?: string;
  history?: IncomingHistoryEntry[];
}
export interface ChatResponse {
  persona: string;
  reply: string;
  timestamp: number;
  model?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message = "", history = [] } = body;
    if (!message.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Normalize history to expected shape for LLM helper
    const normalizedHistory: HistoryEntry[] = history
      .filter(Boolean)
      .map((h) => ({
        role: (h.role === "assistant" ? "assistant" : "user") as ChatRole,
        content: h.content ?? h.text ?? "",
      }))
      .filter((h) => h.content);

    // The generator distinguishes Hitesh using exact string "Hitesh Choudhary"
    const personaName = "Hitesh Choudhary"; // ensure match with systemPrompt switch

    const aiMessage: any = await Response_genrator(
      personaName,
      message,
      normalizedHistory
    );
    const reply =
      typeof aiMessage?.content === "string"
        ? aiMessage.content
        : Array.isArray(aiMessage?.content)
        ? aiMessage.content
            .map((c: any) => (typeof c === "string" ? c : c?.text || ""))
            .join("\n")
        : "(No content returned)";

    const res: ChatResponse = {
      persona: "hitesh",
      reply,
      timestamp: Date.now(),
      model: aiMessage?.model || "gemini-2.0-flash",
    };
    return NextResponse.json(res, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
