import { Router } from "express";
import { pool } from "../db.js";

const router = Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  const { name, email, message } = req.body ?? {};
  const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const n = clean(name, 100), e = clean(email, 150), m = clean(message, 2000);

  if (!n || !m || !EMAIL.test(e)) {
    return res.status(400).json({ error: "Please fill in your name, a valid email and a message." });
  }
  // Parameterised query – never build SQL with string concatenation.
  await pool.query("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)", [n, e, m]);
  res.status(201).json({ ok: true });
});

export default router;
