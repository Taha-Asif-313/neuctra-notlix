import axios from "axios";

/**
 * 🧠 CreateNoteAiAgent_Mistral
 * Uses Mistral (via OpenRouter) to generate smart plain-text notes.
 *
 * @param {string} prompt - The user's input or note topic
 * @returns {Promise<string|null>} - Returns AI-generated text or null if failed
 */
/**
 * 🧠 CreateNoteAiAgent_OpenRouter
 * Uses a free OpenRouter model (LLaMA 3.3 or Mistral) to generate notes or text.
 *
 * @param {string} prompt - The text or note input
 * @returns {Promise<string|null>} - The AI's response
 */
export async function CreateNoteAiAgent(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`, // ✅ your OpenRouter key
        "HTTP-Referer": window.location.origin, // ✅ optional but recommended
        "X-Title": "Notexa AI Agent", // ✅ your app name for OpenRouter rankings
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free", // ✅ Free model (you can swap with mistralai/mistral-7b-instruct:free)
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
    });

    // ✅ Parse and extract the AI’s message
    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content?.trim();

    console.log("🧠 OpenRouter AI says:", aiText);
    return aiText || "No response from AI.";
  } catch (error) {
    console.error("❌ Error fetching from OpenRouter:", error);
    return null;
  }
}

