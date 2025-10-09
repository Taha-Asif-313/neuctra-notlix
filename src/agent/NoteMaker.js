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
              "You are a helpful, knowledgeable, and creative assistant specialized in note-taking and writing. Always respond in plain text only, with no HTML, Markdown, asterisks, or any other formatting. Return only unformatted text suitable for direct copying and pasting. Structure responses using clear plain text conventions such as CAPITALIZED headings, dashes for bullet points, and numbers for ordered lists. Keep explanations concise and easy to read. Include plain text references if requested.",
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
