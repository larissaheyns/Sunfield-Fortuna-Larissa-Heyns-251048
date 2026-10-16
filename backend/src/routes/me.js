import { Router } from "express";
import rateLimit from "express-rate-limit";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth); // everything below needs a logged-in user

const COLUMNS = "id, kind, description, amount, quantity, DATE_FORMAT(donated_on, '%Y-%m-%d') AS donated_on, status, reference";
const tidy = (r) => ({ ...r, amount: r.amount == null ? null : Number(r.amount) });
const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

router.get("/dashboard", async (req, res) => {
  const [[s]] = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN kind = 'money' THEN amount END), 0) AS total_given,
            COALESCE(SUM(CASE WHEN kind = 'items' THEN quantity END), 0) AS items_donated,
            DATE_FORMAT(MIN(donated_on), '%Y-%m-%d') AS donor_since
     FROM donations WHERE user_id = ? AND status = 'received'`, [req.user.id]);
  const [recent] = await pool.query(
    `SELECT ${COLUMNS} FROM donations WHERE user_id = ? ORDER BY donated_on DESC, id DESC LIMIT 4`, [req.user.id]);
  res.json({
    stats: { total_given: Number(s.total_given), items_donated: Number(s.items_donated), donor_since: s.donor_since },
    recent: recent.map(tidy),
  });
});

router.get("/donations", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM donations WHERE user_id = ? ORDER BY donated_on DESC, id DESC LIMIT 500`, [req.user.id]);
  res.json(rows.map(tidy));
});


const pledgeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

router.post("/donations/money", pledgeLimiter, async (req, res) => {
  const amount = Math.round(Number(req.body?.amount) * 100) / 100;
  if (!(amount >= 1) || amount > 1000000) {
    return res.status(400).json({ error: "Please enter an amount of R1 or more (up to R1,000,000)." });
  }
  const [[{ n }]] = await pool.query(
    "SELECT COUNT(*) AS n FROM donations WHERE user_id = ? AND kind = 'money' AND status = 'pending'", [req.user.id]);
  if (n >= 5) {
    return res.status(429).json({ error: "You already have several donations waiting to be confirmed. Please wait until we have confirmed those first." });
  }
  const [r] = await pool.query(
    "INSERT INTO donations (user_id, kind, description, amount, donated_on, status) VALUES (?, 'money', 'Monetary', ?, CURDATE(), 'pending')",
    [req.user.id, amount]);
  const reference = `SF-${String(r.insertId).padStart(6, "0")}`;
  await pool.query("UPDATE donations SET reference = ? WHERE id = ?", [reference, r.insertId]);
  res.status(201).json({ id: r.insertId, reference, amount });
});

router.patch("/profile", async (req, res) => {
  const first = clean(req.body?.first_name, 50), last = clean(req.body?.last_name, 50);
  if (!first || !last) return res.status(400).json({ error: "Please enter your first and last name." });
  await pool.query("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?", [first, last, req.user.id]);
  const [[u]] = await pool.query("SELECT id, first_name, last_name, email, role FROM users WHERE id = ?", [req.user.id]);
  res.json({ user: u });
});

export default router;
