<div align="center">
	<h1>Persona Chat</h1>
	<p>Interactive, WhatsApp‑inspired chat UI with selectable educator personas powered by Google Gemini (OpenAI compatible API).</p>
</div>

## ✨ Features

- Modern Next.js App Router (React 19 / Server + Client Components)
- Persona selection landing page with animated cards & glassmorphism
- WhatsApp‑like chat interface (bubble layout, auto-resize composer, scroll to bottom)
- Two educator personas:
  - `Hitesh Choudhary`
  - `Piyus Garg`
- LLM integration via OpenAI compatible endpoint (Gemini `gemini-2.0-flash` model)
- Conversation history passed to API for contextual answers
- Simple link auto-detection in messages
- Dark mode–friendly theming using CSS variables

> Streaming was prototyped; current committed version returns full responses (no SSE). You can extend it (see "Extending / Streaming" below).

## 📂 Project Structure

```
app/
	page.tsx                # Persona selection screen
	chat/page.tsx           # Chat UI (client component, Suspense-wrapped search params)
	api/chat/hitesh/route.ts
	api/chat/piyush/route.ts
prompts/
	systemPrompts.*         # System prompts (imported by generator)
scripts/
	llmResponseGenerator.ts # Central LLM call helper
public/                   # Static assets (avatars, svgs)
```

## 🔧 Setup

1. Install deps:

```bash
npm install
```

2. Create an `.env.local` file:

```bash
API_KEY=YOUR_GEMINI_API_KEY
```

     - The code currently reads `process.env.API_KEY` in `scripts/llmResponseGenerator.ts`.
     - Key must have access to the Gemini OpenAI-compatible endpoint.

3. Run dev server:

```bash
npm run dev
```

4. Open: http://localhost:3000
5. Select a persona → you are navigated to `/chat?n=hitesh` (or `piyush`).

## 🧠 LLM Integration

Central helper: `scripts/llmResponseGenerator.ts`

Builds messages array:

```
system -> persona system prompt
...history (role: user|assistant, content)
user -> latest question
```

Returns: `response.choices[0].message` (OpenAI chat completion shape).

## 🔌 API Endpoints

Both endpoints accept POST JSON:

```json
{
  "message": "Explain closures in JS",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}
```

Endpoints:

- `POST /api/chat/hitesh`
- `POST /api/chat/piyush`

Response (success):

```json
{
  "persona": "hitesh",
  "reply": "Closures are...",
  "timestamp": 1734300000000,
  "model": "gemini-2.0-flash"
}
```

Response (error):

```json
{ "error": "Message required" }
```

## 💬 Chat UI Behavior

- Keeps messages in local state only (no persistence).
- Auto-scrolls on new message.
- Composer grows until 160px height cap.
- Time shown per bubble (local time HH:MM).
- Initial assistant greeting depends on persona query param.

## 🧪 Quick Local Test (API)

With server running:

```bash
curl -X POST http://localhost:3000/api/chat/hitesh \
	-H 'Content-Type: application/json' \
	-d '{"message":"Hello!","history":[]}'
```

## 🚀 Production Build

```bash
npm run build
npm start
```

## 🔄 Extending / Streaming (Optional)

To re-enable streaming:

1. Convert the route to Edge runtime: `export const runtime = 'edge'`.
2. Use `openai.chat.completions.create({ stream: true, ... })` and iterate async chunks.
3. Emit Server-Sent Events (SSE): `data: {"delta":"..."}\n\n` and final `data: {"done":true}`.
4. In the client, replace the existing JSON fetch with an event stream parser updating a provisional assistant message.

## 🛡️ Environment & Security Notes

- Never hardcode API keys; keep them in `.env.local` (not committed).
- Consider adding rate limiting (e.g., middleware) before exposing publicly.
- Sanitize / limit history length to stay within model token limits.

## 🧱 Possible Improvements

- Shared TypeScript types in a `types/` folder instead of cross-importing route types.
- Add streaming UX (progressive tokens).
- Add abort/cancel in-flight request.
- Persist conversations (DB or localStorage).
- Add persona management (dynamic metadata & avatars).
- Unit tests for message reducer & API normalization.

## ❓ Troubleshooting

| Issue                               | Cause                        | Fix                                       |
| ----------------------------------- | ---------------------------- | ----------------------------------------- |
| `Message required`                  | Empty `message`              | Send non-empty string                     |
| 500 from endpoint                   | Upstream model / key invalid | Check `API_KEY` & quota                   |
| Build error about `useSearchParams` | Missing Suspense wrap        | Already fixed by wrapping in `<Suspense>` |
| Empty reply string                  | Model returned no choices    | Log full response & inspect quota/errors  |

## 📜 License

MIT (adjust as needed).

## 🙌 Acknowledgements

- Google Gemini (OpenAI compatibility layer)
- Next.js team for the App Router
- Inspiration from WhatsApp UI patterns

---

Feel free to open issues or propose improvements.
