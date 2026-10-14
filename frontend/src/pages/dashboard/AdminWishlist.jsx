import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Meter from "../../components/Meter";

const CATEGORIES = ["Food", "Toiletries", "Health", "Clothing", "Books", "Household", "Other"];

function Row({ w, onSave, onRemove }) {
  const [qty, setQty] = useState(w.quantity_needed);
  const [cat, setCat] = useState(w.category);
  const changed = Number(qty) !== w.quantity_needed || cat !== w.category;
  return (
    <tr>
      <td><strong>{w.item}</strong></td>
      <td>
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label={`Category for ${w.item}`}>
          {[...new Set([...CATEGORIES, w.category])].map((c) => <option key={c}>{c}</option>)}
        </select>
      </td>
      <td><input type="number" min="1" max="100000" value={qty} onChange={(e) => setQty(e.target.value)} aria-label={`Quantity needed for ${w.item}`} /></td>
      <td className="meter-cell"><Meter value={w.received} max={Number(qty) || w.quantity_needed} /><span className="meter-label">{w.received} received</span></td>
      <td className="row-actions">
        <button className="btn-ghost" disabled={!changed} onClick={() => onSave(w.id, qty, cat)}>Save</button>
        <button className="btn-danger" onClick={() => window.confirm(`Remove ${w.item} from the wishlist?`) && onRemove(w.id)}>Remove</button>
      </td>
    </tr>
  );
}

export default function AdminWishlist() {
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const note = (state, msg) => setStatus({ state, msg });

  useEffect(() => { api("/admin/wishlist").then(setItems).catch((e) => note("err", e.message)); }, []);

  const run = async (path, method, body, okMsg) => {
    try {
      setItems(await api(path, { method, body: body && JSON.stringify(body) }));
      note("ok", okMsg);
      return true;
    } catch (e) { note("err", e.message); return false; }
  };

  async function add(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const ok = await run("/admin/wishlist", "POST", Object.fromEntries(new FormData(form)), "Item added to the wishlist.");
    if (ok) form.reset();
  }

  return (
    <div className="admin-page">
      <section className="history dash-pad-x page-top">
        <h2>Add an item</h2>
        <p className="history-sub">New items appear on the wishlist notebook on the website straight away.</p>
        <form className="form admin-form" onSubmit={add}>
          <label>Item<input name="item" required maxLength={100} placeholder="e.g. Bread" /></label>
          <label>Category<select name="category" defaultValue="Food">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Quantity needed<input name="quantity_needed" type="number" min="1" max="100000" required defaultValue="10" /></label>
          <button className="btn">Add item</button>
        </form>
        {status.msg && <p className={`form-msg ${status.state}`} role="status">{status.msg}</p>}
      </section>

      <section className="history dash-pad-x">
        <h2>Wishlist</h2>
        <p className="history-sub">Change the quantity needed and press Save. The website shows how many are still needed.</p>
        <div className="table-scroll">
          <table className="wl-table">
            <thead><tr><th>Item</th><th>Category</th><th>Needed</th><th>Received</th><th /></tr></thead>
            <tbody>
              {items?.map((w) => (
                <Row key={`${w.id}-${w.quantity_needed}-${w.category}`} w={w}
                  onSave={(id, q, c) => run(`/admin/wishlist/${id}`, "PATCH", { quantity_needed: q, category: c }, "Saved.")}
                  onRemove={(id) => run(`/admin/wishlist/${id}`, "DELETE", null, "Item removed.")} />
              ))}
            </tbody>
          </table>
        </div>
        {items?.length === 0 && <p>The wishlist is empty. Add the first item above.</p>}
      </section>
    </div>
  );
}
