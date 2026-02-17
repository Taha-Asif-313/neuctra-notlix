// utils/aiBlockParser.js
import { JSDOM } from "jsdom"; // optional, or parse HTML manually

export function parseHtmlToBlocks(html) {
  const blocks = [];

  // Simple parser: split by <h>, <p>, <ul>, <ol>, <img>, <table>
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.body.childNodes.forEach((node) => {
    switch (node.nodeName) {
      case "P":
        blocks.push({ type: "text", content: { html: node.outerHTML, isEditing: false } });
        break;
      case "IMG":
        blocks.push({ type: "image", content: { url: node.src, isEditing: false } });
        break;
      case "UL":
      case "OL":
        blocks.push({ type: "text", content: { html: node.outerHTML, isEditing: false } });
        break;
      case "TABLE":
        // Very basic table parsing
        const rows = Array.from(node.querySelectorAll("tr")).map((tr) =>
          Array.from(tr.children).map((td) => td.textContent)
        );
        const headers = rows[0] || [];
        const bodyRows = rows.slice(1);
        blocks.push({
          type: "table",
          content: {
            headers,
            rows: bodyRows,
            headerAlign: headers.map(() => "center"),
            cellAlign: headers.map(() => "left"),
            isEditing: false,
          },
        });
        break;
      default:
        // fallback for unknown nodes
        blocks.push({ type: "text", content: { html: node.outerHTML || "", isEditing: false } });
    }
  });

  return blocks;
}
