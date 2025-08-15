import { NextResponse } from "next/server";

interface ChatRequestBody {
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message = "", history = [] } = body;

    // Very simple mock persona logic for Hitesh
    const prefix = "Hitesh (educator):";
    const responseContent = `${prefix} ${
      message ? "You asked about " + message + "." : "Hello!"
    } I focus on explaining complex tech in simple terms. Let\'s break it down.`;

    return NextResponse.json({
      persona: "hitesh",
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
