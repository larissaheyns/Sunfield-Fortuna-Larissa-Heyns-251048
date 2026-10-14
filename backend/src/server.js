import "dotenv/config";
import express from "express";
import cors from "cors";
import teamRoutes from "./routes/team.js";
import contactRoutes from "./routes/contact.js";
import wishlistRoutes from "./routes/wishlist.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors({ origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","), credentials: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/team", teamRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
