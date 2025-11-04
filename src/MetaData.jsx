import { useEffect } from "react";

/**
 * 🧠 Custom Metadata Component — Notlix Edition
 * Dynamically injects SEO, Open Graph, and Twitter meta tags.
 * ✅ No Helmet.js required
 * ✅ Automatically builds OG images from title
 * ✅ Safe for SPA route changes
 */
const Metadata = ({
  title = "Notlix — Capture Ideas. Collaborate Intelligently.",
  description = "Neuctra Notes combines AI intelligence, collaboration, and military-grade encryption — all in a beautifully minimal interface.",
  keywords = "Notlix, Neuctra Notes, AI notes, secure collaboration, productivity app, encrypted workspace, idea management",
  image, // optional custom image
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

    // 🧱 Build the full current URL
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    // 🖼️ Auto-generate OG image if not provided
    const ogImage =
      image ||
      `https://notlix.neuctra.com/api/og?title=${encodeURIComponent(
        title
      )}&subtitle=${encodeURIComponent("Collaborate Intelligently")}`;

    // --- Standard Meta ---
    ensureMeta('meta[name="description"]', "description", "name", description);
    ensureMeta('meta[name="keywords"]', "keywords", "name", keywords);

    // --- Open Graph ---
    ensureMeta('meta[property="og:title"]', "og:title", "property", ogTitle || title);
    ensureMeta(
      'meta[property="og:description"]',
      "og:description",
      "property",
      ogDescription || description
    );
    ensureMeta('meta[property="og:image"]', "og:image", "property", ogImage);
    ensureMeta('meta[property="og:type"]', "og:type", "property", "website");
    ensureMeta('meta[property="og:url"]', "og:url", "property", currentUrl);

    // --- Twitter ---
    ensureMeta('meta[name="twitter:card"]', "twitter:card", "name", twitterCard);
    ensureMeta('meta[name="twitter:title"]', "twitter:title", "name", twitterTitle || title);
    ensureMeta(
      'meta[name="twitter:description"]',
      "twitter:description",
      "name",
      twitterDescription || description
    );
    ensureMeta('meta[name="twitter:image"]', "twitter:image", "name", ogImage);
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

  return null; // 🫥 Invisible component
};

export default Metadata;
