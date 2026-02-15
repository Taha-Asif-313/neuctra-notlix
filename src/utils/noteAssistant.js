export async function CreateNoteAiAgent(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`, // ✅ correct usage of env key
        "HTTP-Referer": window.location.origin, // ✅ good practice, optional but helps with OpenRouter analytics
        "X-Title": "Notexa AI Agent", // ✅ app name for rankings
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free", // ✅ free & working model
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
        temperature: 0.7, // ✅ balanced creativity
      }),
    });

    // ✅ Parse response safely
    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content?.trim();

    console.log("🧠 OpenRouter AI says:", aiText);
    return aiText || "No response from AI."; // ✅ safe fallback
  } catch (error) {
    console.error("❌ Error fetching from OpenRouter:", error);
    return null; // ✅ correct error fallback
  }
}
