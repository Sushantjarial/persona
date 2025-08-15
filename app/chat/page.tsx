"use client";
import { useSearchParams } from "next/navigation";

import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  KeyboardEvent,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
};

// Simple ID generator
const uid = () => Math.random().toString(36).slice(2, 11);

export default function ChatPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("n");

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      text: "Hi there 👋\nI'm your learning companion. Ask me anything to get started!",
      ts: Date.now() - 1000 * 60 * 5,
    },
    {
      id: uid(),
      role: "user",
      text: "Hey! Can you help me understand recursion?",
      ts: Date.now() - 1000 * 60 * 4,
    },
    {
      id: uid(),
      role: "assistant",
      text: "Absolutely. Recursion is a way of solving a problem where the solution depends on smaller instances of the same problem. Want a code example?",
      ts: Date.now() - 1000 * 60 * 3,
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = viewportRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isThinking]);

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    const h = ta.scrollHeight;
    ta.style.height = Math.min(h, 160) + "px"; // cap height
  }, [input]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text: trimmed,
      ts: Date.now(),
    };
    const history = messages;
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);
    // Simulated assistant reply
    // setTimeout(() => {
    //   const reply: ChatMessage = {
    //     id: uid(),
    //     role: "assistant",
    //     text: `You said: "${trimmed}". (This is a placeholder response.)`,
    //     ts: Date.now(),
    //   };
    console.log(history, "history", userMsg, messages);

    try {
      const res = await fetch(`/api/chat/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data: ChatMessage = {
        id: uid(),
        role: "assistant",
        text: res.ok ? await res.text() : "Error: Unable to get response",
        ts: Date.now(),
      };
      setMessages((m) => [...m, data]);
      setIsThinking(false);
    } catch (error) {
      console.error("Error sending message:", error);
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
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
        }}
      />
      {/* Chat Shell */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col h-[95vh] max-h-[900px] md:rounded-3xl overflow-hidden shadow-xl bg-[var(--background)]/70 backdrop-blur-xl border border-black/20 dark:border-white/10">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-4  backdrop-blur-md relative">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden bg-white/90 flex items-center justify-center">
              <img
                src={name !== "piyush" ? "./hitesh.jpg" : "./piyush.webp"}
                alt="Companion avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--foreground)" }}
            >
              {name}
            </span>
            <span className="text-xs text-black/60 dark:text-white/50">
              online
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <button
              className="px-3 py-1 rounded-full bg-[var(--accent)] text-white text-xs font-medium shadow-sm hover:shadow transition-all"
              onClick={() => setMessages([])}
            >
              Clear
            </button>
          </div>
          {/* subtle top gradient light */}
          <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
        </div>

        {/* Messages */}
        <div
          ref={viewportRef}
          className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-2 scrollbar-thin"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {isThinking && (
            <div className="flex gap-2 items-end pl-2">
              <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm bg-[var(--bubble)] shadow-sm  flex items-center gap-2">
                <TypingDots />
                <span className="sr-only">Assistant typing…</span>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={onSubmit}
          className="px-3 sm:px-5 pt-2 pb-4 bg-[var(--bubble)]/60 dark:bg-[var(--bubble)]/30 backdrop-blur-md  flex flex-col gap-2"
        >
          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message"
              className="flex-1 resize-none rounded-2xl bg-white/80 dark:bg-white/10 px-4 py-3 text-sm leading-relaxed shadow-inner  focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/60 placeholder:text-black/40 dark:placeholder:text-white/40 text-black dark:text-[var(--foreground)]"
              rows={1}
              maxLength={4000}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="h-11 px-5 rounded-2xl bg-[var(--accent)] text-white font-medium text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-[0.97] transition-all"
            >
              Send
            </button>
          </div>
          <div className="flex justify-between px-1 text-[10px] uppercase tracking-wide text-black/40 dark:text-white/40">
            <span>Shift+Enter for newline</span>
            <span>{input.length}/4000</span>
          </div>
        </form>
      </div>
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }
        @media (prefers-color-scheme: dark) {
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const mine = msg.role === "user";
  return (
    <div className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm border " +
          (mine
            ? "bg-[var(--bubble-alt)] text-black/90 dark:text-[var(--foreground)] border-black/5 dark:border-white/10 rounded-br-sm"
            : "bg-[var(--bubble)] text-black/80 dark:text-[var(--foreground)] border-black/5 dark:border-white/10 rounded-bl-sm")
        }
      >
        {msg.text.split(/\n+/).map((line, i) => (
          <p key={i} className="whitespace-pre-wrap break-words">
            {line}
          </p>
        ))}
        <span className="mt-1 block text-[10px] opacity-40 select-none">
          {new Date(msg.ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--accent)]/70 animate-pulse"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}
