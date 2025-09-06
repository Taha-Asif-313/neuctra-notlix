import axios from "axios";

export async function CreateNoteAiAgent(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful, knowledgeable, and creative assistant specialized in note-taking and writing. By default, always respond in plain text only, with no HTML, Markdown, or any formatting. Return only unformatted text suitable for direct copying and pasting. Keep answers clear, concise, and readable. Structure content with headings, short paragraphs, and lists using plain text (for example, using CAPITALIZED headings, dashes for bullet points, or numbers for ordered lists). Include references in plain text if requested.",
          },

          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Get AI response text
    const aiText = response.data?.choices?.[0]?.message?.content;
    console.log("AI says:", aiText);
    return aiText;
  } catch (err) {
    console.error("Error fetching AI response:", err);
    return null;
  }
}
