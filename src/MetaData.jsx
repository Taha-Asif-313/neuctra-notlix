import { useEffect } from "react";

/**
 * 🧠 Custom Metadata Component (Enhanced)
 * Dynamically injects SEO, OpenGraph, and Twitter meta tags.
 * - Works without Helmet.js
 * - Fully supports title overrides for OG & Twitter
 * - Avoids duplicate tag creation
 */
const Metadata = ({
  title,
  description,
  keywords,
  image,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterCard = "summary_large_image",
}) => {
  useEffect(() => {
    if (title) document.title = title;

    const ensureMeta = (selector, key, attr, content) => {
      if (!content) return;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 🧱 Standard Meta
    ensureMeta('meta[name="description"]', "description", "name", description);
    ensureMeta('meta[name="keywords"]', "keywords", "name", keywords);

    // 🧩 Open Graph (for social media)
    ensureMeta('meta[property="og:title"]', "og:title", "property", ogTitle || title);
    ensureMeta(
      'meta[property="og:description"]',
      "og:description",
      "property",
      ogDescription || description
    );
    ensureMeta('meta[property="og:image"]', "og:image", "property", image);
    ensureMeta('meta[property="og:type"]', "og:type", "property", "website");
    ensureMeta('meta[property="og:url"]', "og:url", "property", window.location.href);

    // 🐦 Twitter Card
    ensureMeta('meta[name="twitter:card"]', "twitter:card", "name", twitterCard);
    ensureMeta('meta[name="twitter:title"]', "twitter:title", "name", twitterTitle || title);
    ensureMeta(
      'meta[name="twitter:description"]',
      "twitter:description",
      "name",
      twitterDescription || description
    );
    ensureMeta('meta[name="twitter:image"]', "twitter:image", "name", image);
  }, [
    title,
    description,
    keywords,
    image,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    twitterCard,
  ]);

  return null; // 🫥 nothing rendered visually
};

export default Metadata;
