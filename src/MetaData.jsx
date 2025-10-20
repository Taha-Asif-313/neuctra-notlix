import { useEffect } from "react";

/**
 * 🧠 Custom Metadata component
 * Dynamically updates <title>, <meta> tags, and social preview tags
 * Works without Helmet.js
 */
const Metadata = ({ title, description, keywords, image }) => {
  useEffect(() => {
    if (title) document.title = title;

    const updateMeta = (name, content) => {
      if (!content) return;
      let tag =
        document.querySelector(`meta[name="${name}"]`) ||
        document.createElement("meta");
      tag.setAttribute("name", name);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    };

    const updateProperty = (property, content) => {
      if (!content) return;
      let tag =
        document.querySelector(`meta[property="${property}"]`) ||
        document.createElement("meta");
      tag.setAttribute("property", property);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    };

    // 🧱 Standard Meta
    updateMeta("description", description);
    updateMeta("keywords", keywords);

    // 🧩 Open Graph (for social media)
    updateProperty("og:title", title);
    updateProperty("og:description", description);
    updateProperty("og:image", image);
    updateProperty("og:type", "website");
    updateProperty("og:url", window.location.href);

    // 🐦 Twitter Card
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
  }, [title, description, keywords, image]);

  return null; // 🫥 nothing rendered visually
};

export default Metadata;
