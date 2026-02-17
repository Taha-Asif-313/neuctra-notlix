import { useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";

export function useNoteAiAgent() {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const { user } = useAppContext();

  const generateBlock = useCallback(async (prompt) => {
    if (!prompt?.trim()) return null;

    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Notexa AI Agent",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openrouter/aurora-alpha",
            messages: [
              {
                role: "system",
                content: `
You are a block-based editor assistant.

VERY IMPORTANT RULES:

1. Return ONLY ONE block.
2. Return STRICT VALID JSON.
3. No markdown.
4. No explanation.
5. No extra text.
6. Do not wrap JSON in code blocks.

Allowed types:
- text
- image
- imageText
- table

FORMAT:

For text:
{
  "type": "text",
  "content": { "html": "<p>...</p>" }
}

For image:
{
  "type": "image"
}

For imageText:
{
  "type": "imageText",
  "content": {
    "html": "<p>...</p>",
    "direction": "left"
  }
}

For table:
{
  "type": "table",
  "content": {
    "headers": ["Col1", "Col2"],
    "rows": [["A","B"],["C","D"]]
  }
}

Return only one object.
                `.trim(),
              },
              { role: "user", content: prompt },
            ],
          }),
        },
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content?.trim();

      const parsed = JSON.parse(raw);

      return parsed;
    } catch (err) {
      console.error("AI block generation failed:", err);
      setAiError("Invalid AI response");
      return null;
    } finally {
      setAiLoading(false);
    }
  }, [user]);

  return { generateBlock, aiLoading, aiError };
}
