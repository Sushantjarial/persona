import { NextResponse } from "next/server";
import Response_genrator from "../../../../scripts/llmResponseGenerator";
import type {
  ChatRole,
  HistoryEntry,
  IncomingHistoryEntry,
  ChatResponse,
} from "../hitesh/route";

export interface ChatRequestBody {
  message?: string;
  history?: IncomingHistoryEntry[];
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message = "", history = [] } = body;
    if (!message.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const normalizedHistory: HistoryEntry[] = history
      .filter(Boolean)
      .map((h) => ({
        role: (h.role === "assistant" ? "assistant" : "user") as ChatRole,
        content: h.content ?? h.text ?? "",
      }))
      .filter((h) => h.content);

    const personaName = "Piyus Garg"; // ensure matches alternate system prompt branch
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
      persona: "piyush",
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
