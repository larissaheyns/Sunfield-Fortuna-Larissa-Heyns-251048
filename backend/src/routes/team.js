import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, role, photo_url FROM team_members WHERE is_active = 1 ORDER BY sort_order, id"
  );
  res.json(rows);
});

export default router;
