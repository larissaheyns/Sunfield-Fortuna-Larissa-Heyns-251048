import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth, requireAdmin); // every route below is admin-only

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v, min, max) => (Number.isInteger(Number(v)) && Number(v) >= min && Number(v) <= max ? Number(v) : null);
const bad = (res, msg) => res.status(400).json({ error: msg });

const WISHLIST_SQL = `
  SELECT w.id, w.item, w.category, w.quantity_needed,
         COALESCE(SUM(CASE WHEN d.status = 'received' THEN d.quantity END), 0) AS received
  FROM wishlist_items w
  LEFT JOIN donations d ON d.wishlist_item_id = w.id AND d.kind = 'items'
  WHERE w.is_active = 1 GROUP BY w.id ORDER BY w.sort_order, w.id`;
const wishlist = async () => (await pool.query(WISHLIST_SQL))[0].map((r) => ({ ...r, received: Number(r.received) }));

const DONATION_SQL = `
  SELECT d.id, d.kind, d.description, d.amount, d.quantity, d.status, d.reference,
         DATE_FORMAT(d.donated_on, '%Y-%m-%d') AS donated_on,
         CONCAT(u.first_name, ' ', u.last_name) AS donor
  FROM donations d JOIN users u ON u.id = d.user_id
  ORDER BY d.donated_on DESC, d.id DESC LIMIT ?`;
const donations = async (limit) =>
  (await pool.query(DONATION_SQL, [limit]))[0].map((r) => ({ ...r, amount: r.amount == null ? null : Number(r.amount) }));

// ---------- overview ----------
router.get("/overview", async (req, res) => {
  const money = "COALESCE(SUM(CASE WHEN kind = 'money' THEN amount END), 0)";
  const items = "COALESCE(SUM(CASE WHEN kind = 'items' THEN quantity END), 0)";
  const [[totals]] = await pool.query(`SELECT ${money} AS money, ${items} AS items FROM donations WHERE status = 'received'`);
  const [[month]] = await pool.query(
    `SELECT ${money} AS money, ${items} AS items FROM donations
     WHERE status = 'received' AND donated_on >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`);
  const [byMonth] = await pool.query(
    `SELECT DATE_FORMAT(donated_on, '%Y-%m') AS ym, ${money} AS money, ${items} AS items FROM donations
     WHERE status = 'received' AND donated_on >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
     GROUP BY ym`);

  const found = new Map(byMonth.map((r) => [r.ym, r]));
  const now = new Date();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const r = found.get(ym);
    return { month: ym, money: Number(r?.money ?? 0), items: Number(r?.items ?? 0) };
  });

  res.json({
    totals: { money: Number(totals.money), items: Number(totals.items) },
    month: { money: Number(month.money), items: Number(month.items) },
    monthly,
    recent: await donations(6),
    wishlist: await wishlist(),
  });
});

// ---------- wishlist ----------
router.get("/wishlist", async (req, res) => res.json(await wishlist()));

router.post("/wishlist", async (req, res) => {
  const item = clean(req.body?.item, 100), category = clean(req.body?.category, 50) || "Other";
  const qty = int(req.body?.quantity_needed, 1, 100000);
  if (!item) return bad(res, "Please enter the item name.");
  if (qty === null) return bad(res, "Please enter how many are needed (1 or more).");

  const [[{ n }]] = await pool.query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM wishlist_items");
  const [existing] = await pool.query("SELECT id, is_active FROM wishlist_items WHERE item = ?", [item]);
  if (existing[0]?.is_active) return res.status(409).json({ error: "That item is already on the wishlist." });
  if (existing[0]) {
    await pool.query("UPDATE wishlist_items SET is_active = 1, category = ?, quantity_needed = ?, sort_order = ? WHERE id = ?", [category, qty, n, existing[0].id]);
  } else {
    await pool.query("INSERT INTO wishlist_items (item, category, quantity_needed, sort_order) VALUES (?, ?, ?, ?)", [item, category, qty, n]);
  }
  res.status(201).json(await wishlist());
});

router.patch("/wishlist/:id", async (req, res) => {
  const qty = int(req.body?.quantity_needed, 1, 100000), category = clean(req.body?.category, 50) || "Other";
  if (qty === null) return bad(res, "Please enter a quantity of 1 or more.");
  await pool.query("UPDATE wishlist_items SET quantity_needed = ?, category = ? WHERE id = ?", [qty, category, Number(req.params.id)]);
  res.json(await wishlist());
});

router.delete("/wishlist/:id", async (req, res) => { // hidden, not deleted, so past donations keep their link
  await pool.query("UPDATE wishlist_items SET is_active = 0 WHERE id = ?", [Number(req.params.id)]);
  res.json(await wishlist());
});

// ---------- donations ----------
router.get("/users", async (req, res) => {
  const [rows] = await pool.query("SELECT id, first_name, last_name, email FROM users ORDER BY first_name, last_name LIMIT 1000");
  res.json(rows);
});

router.get("/donations", async (req, res) => res.json(await donations(50)));

router.post("/donations", async (req, res) => {
  const b = req.body ?? {};
  const uid = int(b.user_id, 1, 4294967295);
  if (uid === null) return bad(res, "Please choose a donor.");
  const [u] = await pool.query("SELECT id FROM users WHERE id = ?", [uid]);
  if (!u.length) return bad(res, "That donor does not exist.");
  if (!["money", "items"].includes(b.kind)) return bad(res, "Choose money or items.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.donated_on ?? "")) return bad(res, "Please choose a valid date.");
  const status = b.status === "pending" ? "pending" : "received";

  let description, amount = null, quantity = null, wishlistId = null;
  if (b.kind === "money") {
    amount = Math.round(Number(b.amount) * 100) / 100;
    if (!(amount > 0) || amount > 10000000) return bad(res, "Please enter an amount greater than 0.");
    description = "Monetary";
  } else {
    quantity = int(b.quantity, 1, 100000);
    if (quantity === null) return bad(res, "Please enter how many items (1 or more).");
    if (b.wishlist_item_id) {
      wishlistId = int(b.wishlist_item_id, 1, 4294967295);
      const [w] = await pool.query("SELECT item FROM wishlist_items WHERE id = ?", [wishlistId]);
      if (wishlistId === null || !w.length) return bad(res, "That wishlist item does not exist.");
      description = w[0].item;
    } else {
      description = clean(b.description, 100);
      if (!description) return bad(res, "Please describe what was donated.");
    }
  }
  await pool.query(
    `INSERT INTO donations (user_id, wishlist_item_id, kind, description, amount, quantity, donated_on, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [uid, wishlistId, b.kind, description, amount, quantity, b.donated_on, status]);
  res.status(201).json(await donations(50));
});

router.patch("/donations/:id/received", async (req, res) => {
  await pool.query("UPDATE donations SET status = 'received' WHERE id = ?", [Number(req.params.id)]);
  res.json(await donations(50));
});

export default router;
