import "dotenv/config";

console.log("COOKIE_SAMESITE:", process.env.COOKIE_SAMESITE);
console.log("NODE_ENV:", process.env.NODE_ENV);

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import teamRoutes from "./routes/team.js";
import contactRoutes from "./routes/contact.js";
import wishlistRoutes from "./routes/wishlist.js";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); 

app.use(cors({ origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","), credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/team", teamRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

const clientDir = path.resolve(__dirname, "../public");
if (fs.existsSync(clientDir)) {
  const seo = JSON.parse(fs.readFileSync(path.join(__dirname, "seo.json"), "utf8")); // copied here by build-release.mjs
  const template = fs.readFileSync(path.join(clientDir, "index.html"), "utf8");

  const siteUrl = (req) => (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  const clean = (p) => p.replace(/\/+$/, "") || "/";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  app.get("/robots.txt", (req, res) =>
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /api/\n\nSitemap: ${siteUrl(req)}/sitemap.xml\n`));

  app.get("/sitemap.xml", (req, res) => {
    const urls = Object.keys(seo.pages).map((p) => `  <url><loc>${siteUrl(req)}${p === "/" ? "" : p}</loc></url>`).join("\n");
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  });

  app.use("/assets", express.static(path.join(clientDir, "assets"), { immutable: true, maxAge: "1y" }));
  app.use(express.static(clientDir, { index: false }));

  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    const p = clean(req.path);
    const page = seo.pages[p];
    const isPrivate = seo.private.some((x) => p === x || p.startsWith(x + "/"));
    const base = siteUrl(req);
    const html = template
      .replaceAll("__TITLE__", esc(page ? page.title : seo.siteName))
      .replaceAll("__DESCRIPTION__", esc((page ?? seo.pages["/"]).description))
      .replaceAll("__URL__", esc(base + (p === "/" ? "" : p)))
      .replaceAll("__IMAGE__", esc(`${base}/og-image.png`))
      .replaceAll("__ROBOTS__", page ? "index,follow" : "noindex,nofollow");
    res.status(page || isPrivate ? 200 : 404).type("html").send(html); // unknown addresses get a real 404
  });
}

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
