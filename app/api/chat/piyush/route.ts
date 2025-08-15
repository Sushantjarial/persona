import { NextResponse } from "next/server";
import Response_genrator, {
  streamResponseGenerator,
  type HistoryEntry,
  type ChatRole,
} from "../../../../scripts/llmResponseGenerator";
import type { IncomingHistoryEntry, ChatResponse } from "../hitesh/route";

export interface ChatRequestBody {
  message?: string;
  history?: IncomingHistoryEntry[];
}

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const streamMode =
      url.searchParams.get("stream") === "1" ||
      req.headers.get("accept")?.includes("text/event-stream");
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
    if (streamMode) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const delta of streamResponseGenerator(
              personaName,
              message,
              normalizedHistory
            )) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
              );
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );
            controller.close();
          } catch (err: any) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  error: err?.message || "stream_error",
                })}\n\n`
              )
            );
            controller.close();
          }
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

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
