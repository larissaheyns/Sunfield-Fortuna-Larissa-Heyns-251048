import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seo from "../data/seo.json";
import { SITE } from "../data/site";
import { useConsent, loadAnalytics, trackPage } from "../lib/analytics";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
  el.href = href;
}
const real = (v) => v && !/TODO/i.test(v);

function setOrganisation(on, base) {
  let el = document.getElementById("ld-org");
  if (!on) return el?.remove();
  if (!el) { el = document.createElement("script"); el.type = "application/ld+json"; el.id = "ld-org"; document.head.appendChild(el); }
  el.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "NGO", name: SITE.name, url: base, logo: `${base}/logo.png`,
    description: seo.pages["/"].description, foundingDate: "1991",
    ...(real(SITE.email) && { email: SITE.email }),
    ...(real(SITE.phone) && { telephone: SITE.phone }),
    ...(real(SITE.address) && { address: { "@type": "PostalAddress", streetAddress: SITE.address, addressCountry: "ZA" } }),
    ...(SITE.facebookUrl && { sameAs: [SITE.facebookUrl] }),
  });
}

export default function SiteMeta() {
  const { pathname } = useLocation();
  const consent = useConsent();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const page = seo.pages[path];
    const base = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const url = base + (path === "/" ? "" : path);
    const title = page ? page.title : seo.siteName;
    const description = (page ?? seo.pages["/"]).description;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", page ? "index,follow" : "noindex,nofollow");
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", `${base}/og-image.png`);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", `${base}/og-image.png`);
    setOrganisation(path === "/", base);

    if (consent === "accepted" && !path.startsWith("/dashboard")) { // private pages are never tracked
      loadAnalytics();
      trackPage(path);
    }
  }, [pathname, consent]);

  return null;
}
