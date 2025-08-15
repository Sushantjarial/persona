import { NextResponse } from "next/server";

interface ChatRequestBody {
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message = "", history = [] } = body;

    // Simple mock persona logic for Piyush
    const prefix = "Piyush (mentor):";
    const responseContent = `${prefix} ${
      message ? "Great point about " + message + "." : "Hi!"
    } I like to give practical, project-oriented guidance. What\'s your next goal?`;

    return NextResponse.json({
      persona: "piyush",
      reply: responseContent,
      received: message,
      historyLength: history.length,
      timestamp: Date.now(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Invalid request" },
      { status: 400 }
    );
  }
}
