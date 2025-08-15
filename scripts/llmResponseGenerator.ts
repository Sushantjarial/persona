import OpenAI from "openai";
import { systemPromptHC, systemPromptPA } from "../prompts/systemPrompts";
export default async function Response_genrator(persona, question, history) {
  const openai = new OpenAI({
    apiKey: " AIzaSyCigUF0L9ZNyf9SXPxHdzHu5ibKWxdJiao",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  const systemPrompt =
    persona === "Hitesh Choudhary" ? systemPromptHC : systemPromptPA;

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...history.map((h: any) => ({
        role: h.role,
        content: h.content,
      })),
      {
        role: "user",
        content: question,
      },
    ],
  });

  return response.choices[0].message;
}
