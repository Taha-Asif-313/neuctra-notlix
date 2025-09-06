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
            content: `
    You are a highly creative and helpful assistant that generates content strictly as valid HTML.
    Guidelines:
    1. Always return fully formatted HTML snippets; never use Markdown, plain text, or backticks.
    2. Use semantic HTML tags like <h1>-<h6>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a>, <span>, <div>, etc.
    3. Apply inline CSS for styling to make the content visually attractive and interactive. Examples:
       - Bold headings: <h1 style="color: #1E40AF; font-weight: bold;">Title</h1>
       - Colored paragraphs: <p style="color: #374151; font-size: 16px;">Text</p>
       - Spacing: use <br/> for line breaks where appropriate.
    4. For lists, style the items using inline CSS to make them visually distinct.
    5. Ensure the HTML is clean, well-structured, and ready to render directly in a browser or contentEditable editor.
    6. Include visually appealing elements like colored headings, highlighted text, subtle spacing, and basic interactive cues where relevant.
    
    Example output:
    <h1 style="color: green; font-weight: bold;">Hello World</h1>
    <p style="color: #111827; font-size: 16px;">This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <ul>
      <li style="margin-bottom: 8px;">First item</li>
      <li style="margin-bottom: 8px;">Second item</li>
    </ul>
    <p style="color: #111827;">Use <br/> tags to add line breaks as needed.</p>
  `,
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
