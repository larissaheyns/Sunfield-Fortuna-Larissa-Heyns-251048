import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT w.id, w.item,
            GREATEST(w.quantity_needed - COALESCE(SUM(CASE WHEN d.status = 'received' THEN d.quantity END), 0), 0) AS still_needed
     FROM wishlist_items w
     LEFT JOIN donations d ON d.wishlist_item_id = w.id AND d.kind = 'items'
     WHERE w.is_active = 1
     GROUP BY w.id
     HAVING still_needed > 0
     ORDER BY w.sort_order, w.id`);
  res.json(rows.map((r) => ({ ...r, still_needed: Number(r.still_needed) })));
});

export default router;
