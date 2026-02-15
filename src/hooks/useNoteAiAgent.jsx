import { useState, useCallback } from "react";
import { marked } from "marked";
import { useAppContext } from "../context/AppContext";

export function useNoteAiAgent() {
  const [aiResponses, setAiResponses] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const { user } = useAppContext();

  const generateNote = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Notexa AI Agent",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "You are a structured, helpful AI that writes clean and concise notes. Use simple Markdown and keep formatting minimal.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content?.trim() || "";
      const htmlText = marked.parse(rawText, { breaks: true });

      const newEntry = {
        id: Date.now(),
        prompt,
        rawText,
        htmlText,
      };

      setAiResponses((prev) => [newEntry, ...prev]);
      return htmlText;
    } catch (err) {
      console.error("❌ AI generation failed:", err);
      setAiError(err.message || "AI generation failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  }, [user]);

  return { generateNote, aiResponses, aiLoading, aiError };
}
