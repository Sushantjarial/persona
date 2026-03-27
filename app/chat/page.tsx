"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  KeyboardEvent,
  Suspense,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
};

const uid = () => Math.random().toString(36).slice(2, 11);

const capitalize = (s: string | null) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "AI";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatFallback />}>
      <InnerChat />
    </Suspense>
  );
}

function ChatFallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#25d366]/70 animate-pulse"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>
        <p className="text-white/40 text-xs tracking-wide uppercase">Loading…</p>
      </div>
    </div>
  );
}

function InnerChat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("n");

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      text:
        name === "piyush"
          ? "hi bhai kya hal chal aapke 👋"
          : "hanji , kya haal h aapke ☕",
      ts: Date.now() - 1000 * 60 * 5,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text: trimmed,
      ts: Date.now(),
    };
    const history = messages;
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantId = uid();
    let accumulated = "";
    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", text: "", ts: Date.now() },
    ]);

    try {
      const res = await fetch(`/api/chat/${name}?stream=1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.body || !ct.includes("text/event-stream")) {
        const json = res.ok
          ? await res.json()
          : { reply: "Error: Unable to get response" };
        accumulated = json.reply || "(empty)";
        setMessages((msgs) =>
          msgs.map((m) =>
            m.id === assistantId
              ? { ...m, text: accumulated, ts: Date.now() }
              : m
          )
        );
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\n\n/);
        buffer = events.pop() || "";
        for (const evt of events) {
          const dataLine = evt.split(/\n/).find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          try {
            const payload = JSON.parse(dataLine.slice(5).trim());
            if (payload.delta) {
              accumulated += payload.delta;
              setMessages((msgs) =>
                msgs.map((m) =>
                  m.id === assistantId ? { ...m, text: accumulated } : m
                )
              );
            }
            if (payload.error) {
              setMessages((msgs) =>
                msgs.map((m) =>
                  m.id === assistantId
                    ? { ...m, text: `Error: ${payload.error}` }
                    : m
                )
              );
            }
            if (payload.done) {
              setMessages((msgs) =>
                msgs.map((m) =>
                  m.id === assistantId ? { ...m, ts: Date.now() } : m
                )
              );
            }
          } catch (_) {
            /* ignore */
          }
        }
      }
    } catch (error) {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === assistantId
            ? { ...m, text: "Error: Unable to stream response" }
            : m
        )
      );
      console.error("Error sending message:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black px-2 py-4">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,211,102,0.12), transparent 65%), #000000",
        }}
      />

      {/* Chat Shell */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col h-[95vh] max-h-[900px] md:rounded-3xl overflow-hidden shadow-2xl bg-[var(--background)] backdrop-blur-xl border border-black/15 dark:border-white/8">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bubble)]/80 dark:bg-[var(--bubble)]/60 backdrop-blur-md relative flex-shrink-0">
          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full hover:bg-black/8 dark:hover:bg-white/10 transition-colors"
            aria-label="Back to home"
            style={{ color: "var(--foreground)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Avatar */}
          <div className="relative w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden bg-white/90">
              <img
                src={name !== "piyush" ? "./hitesh.jpg" : "./piyush.webp"}
                alt={`${capitalize(name)} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--accent)] border-2 border-[var(--bubble)]" />
          </div>

          {/* Name + status */}
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--foreground)" }}
            >
              {capitalize(name)}
            </span>
            <span className="text-[11px] opacity-50" style={{ color: "var(--foreground)" }}>
              online
            </span>
          </div>

          {/* Clear button */}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm hover:shadow-md active:scale-95 transition-all"
              style={{ background: "var(--accent)" }}
              onClick={() => setMessages([])}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
              </svg>
              Clear
            </button>
          </div>

          {/* Bottom separator */}
          <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        </div>

        {/* Messages */}
        <div
          ref={viewportRef}
          className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-2"
        >
          {messages.length === 0 ? (
            <EmptyState name={name} />
          ) : (
            messages.map((m) => <MessageBubble key={m.id} msg={m} />)
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={onSubmit}
          className="px-3 sm:px-4 pt-3 pb-4 bg-[var(--bubble)]/60 dark:bg-[var(--bubble)]/40 backdrop-blur-md flex flex-col gap-2 flex-shrink-0 border-t border-black/5 dark:border-white/5"
        >
          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Message ${capitalize(name)}…`}
              className="flex-1 resize-none rounded-2xl bg-white/90 dark:bg-white/10 px-4 py-3 text-sm leading-relaxed shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 placeholder:text-black/35 dark:placeholder:text-white/35 text-black dark:text-[var(--foreground)] transition-all"
              rows={1}
              maxLength={4000}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-2xl text-white shadow disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md active:scale-[0.96] transition-all"
              style={{ background: "var(--accent)" }}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between px-1 text-[10px] uppercase tracking-wide opacity-35" style={{ color: "var(--foreground)" }}>
            <span>Enter to send · Shift+Enter for newline</span>
            <span>{input.length}/4000</span>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ name }: { name: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 select-none">
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 p-[3px] shadow-lg">
        <div className="w-full h-full rounded-full overflow-hidden bg-white/90">
          <img
            src={name !== "piyush" ? "./hitesh.jpg" : "./piyush.webp"}
            alt={`${capitalize(name)} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          {capitalize(name)}
        </p>
        <p className="text-xs opacity-45" style={{ color: "var(--foreground)" }}>
          Say hi to start the conversation
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const mine = msg.role === "user";
  const isEmpty = msg.text === "" && !mine;

  return (
    <div className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm border " +
          (mine
            ? "bg-[var(--bubble-alt)] text-black/90 dark:text-[var(--foreground)] border-black/5 dark:border-white/10 rounded-br-sm"
            : "bg-[var(--bubble)] text-black/80 dark:text-[var(--foreground)] border-black/5 dark:border-white/10 rounded-bl-sm")
        }
      >
        {isEmpty ? (
          <TypingDots />
        ) : (
          msg.text.split(/\n+/).map((line, i) => (
            <p key={i} className="whitespace-pre-wrap break-words">
              {linkify(line)}
            </p>
          ))
        )}
        {!isEmpty && (
          <span className="mt-1 block text-[10px] opacity-35 select-none text-right">
            {new Date(msg.ts).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--accent)]/60 animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}

const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-words"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};
