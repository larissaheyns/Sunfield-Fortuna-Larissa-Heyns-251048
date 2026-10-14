import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { pool } from "../db.js";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not set in backend/.env");

const router = Router();
const COOKIE = "sf_token";
const base = { httpOnly: true, sameSite: process.env.COOKIE_SAMESITE || "lax", secure: process.env.NODE_ENV === "production" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12); 

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const publicUser = (u) => ({ id: u.id, first_name: u.first_name, last_name: u.last_name, email: u.email, role: u.role });
const startSession = (res, u) =>
  res.cookie(COOKIE, jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: "7d" }), { ...base, maxAge: 7 * 24 * 3600 * 1000 });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in a few minutes." },
});

router.post("/register", limiter, async (req, res) => {
  const b = req.body ?? {};
  const first = clean(b.first_name, 50), last = clean(b.last_name, 50), email = clean(b.email, 150).toLowerCase();
  const pw = typeof b.password === "string" ? b.password : "";
  if (!first || !last || !EMAIL.test(email)) return res.status(400).json({ error: "Please enter your name and a valid email." });
  if (pw.length < 8 || pw.length > 72) return res.status(400).json({ error: "Your password must be 8 to 72 characters long." });

  const taken = { error: "An account with that email already exists. Try logging in." };
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) return res.status(409).json(taken);

  const hash = await bcrypt.hash(pw, 12);
  try {
    const [r] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)", [first, last, email, hash]);
    const user = { id: r.insertId, first_name: first, last_name: last, email, role: "member" };
    startSession(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json(taken);
    throw err;
  }
});

router.post("/login", limiter, async (req, res) => {
  const email = clean(req.body?.email, 150).toLowerCase();
  const pw = typeof req.body?.password === "string" ? req.body.password : "";
  const [rows] = await pool.query(
    "SELECT id, first_name, last_name, email, role, password_hash FROM users WHERE email = ?", [email]);
  const u = rows[0];
  const ok = await bcrypt.compare(pw, u?.password_hash ?? DUMMY_HASH);
  if (!u || !ok) return res.status(401).json({ error: "Incorrect email or password." });
  startSession(res, u);
  res.json({ user: publicUser(u) });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE, base);
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.json({ user: null });
  let id;
  try { ({ id } = jwt.verify(token, SECRET)); } catch { return res.json({ user: null }); }
  const [rows] = await pool.query("SELECT id, first_name, last_name, email, role FROM users WHERE id = ?", [id]);
  res.json({ user: rows[0] ? publicUser(rows[0]) : null });
});

export default router;
