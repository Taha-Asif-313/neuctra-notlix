import { useState, useCallback } from "react";
import { updatePackageUsage } from "../authix/authixinit";
import { useAppContext } from "../context/useAppContext";

/**
 * 🧠 useNoteAiAgent — React Hook for AI note generation via OpenRouter
 *
 * Usage:
 * const { generateNote, aiText, loading, error } = useNoteAiAgent();
 * await generateNote("Write a note about productivity tips");
 */
export function useNoteAiAgent() {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAppContext();

  const generateNote = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
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
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful AI assistant specialized in writing clean, structured notes. Use plain text formatting only. Avoid markdown and emojis.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

     

      const data = await response.json();
      const aiResponse =
        data?.choices?.[0]?.message?.content?.trim() || "No response from AI.";
      console.log("🧠 OpenRouter AI says:", aiResponse);

      setAiText(aiResponse);
      return aiResponse;
    } catch (err) {
      console.error("❌ AI generation failed:", err);
      setError(err.message || "AI generation failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateNote, aiText, loading, error };
}
