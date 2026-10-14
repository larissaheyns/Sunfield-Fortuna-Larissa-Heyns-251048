import { Router } from "express";
import { pool } from "../db.js";

const router = Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body ?? {};
  const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const n = clean(name, 100), e = clean(email, 150), s = clean(subject, 100), m = clean(message, 2000);

  if (!n || !s || !m || !EMAIL.test(e)) {
    return res.status(400).json({ error: "Please fill in your name, a valid email, a subject and a message." });
  }
  // Parameterised query – never build SQL with string concatenation.
  await pool.query("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)", [n, e, s, m]);
  res.status(201).json({ ok: true });
});

export default router;
