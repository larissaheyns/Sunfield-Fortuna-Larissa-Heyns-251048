import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { iconFor, qtyText, fmtDate } from "../../components/DonationList";

const today = () => new Date().toLocaleDateString("en-CA"); 

export default function AdminDonations() {
  const [users, setUsers] = useState([]);
  const [wish, setWish] = useState([]);
  const [list, setList] = useState([]);
  const [kind, setKind] = useState("items");
  const [item, setItem] = useState("");   
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  useEffect(() => {
    Promise.all([api("/admin/users"), api("/admin/wishlist"), api("/admin/donations")])
      .then(([u, w, d]) => { setUsers(u); setWish(w); setList(d); })
      .catch((e) => setStatus({ state: "err", msg: e.message }));
  }, []);

  async function record(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    if (body.wishlist_item_id === "other") delete body.wishlist_item_id;
    try {
      setList(await api("/admin/donations", { method: "POST", body: JSON.stringify({ ...body, kind }) }));
      setWish(await api("/admin/wishlist")); // refresh the progress numbers
      form.reset();
      setItem("");
      setStatus({ state: "ok", msg: "Donation recorded." });
    } catch (err) { setStatus({ state: "err", msg: err.message }); }
  }

  async function markReceived(id) {
    try { setList(await api(`/admin/donations/${id}/received`, { method: "PATCH" })); } catch (err) { setStatus({ state: "err", msg: err.message }); }
  }

  return (
    <div className="admin-page">
      <section className="history dash-pad-x page-top">
        <h2>Record a donation</h2>
        <p className="history-sub">Add a donation once it has arrived. It shows in the donor’s history and updates the wishlist bars.</p>
        <form className="form record-form" onSubmit={record}>
          <label>Donor
            <select name="user_id" required defaultValue="">
              <option value="" disabled>Choose a donor</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>)}
            </select>
          </label>
          <label>Type
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="items">Items</option><option value="money">Money</option>
            </select>
          </label>

          {kind === "money" ? (
            <label>Amount (R)<input name="amount" type="number" min="0.01" step="0.01" required /></label>
          ) : (
            <>
              <label>Item
                <select name="wishlist_item_id" required value={item} onChange={(e) => setItem(e.target.value)}>
                  <option value="" disabled>Choose an item</option>
                  {wish.map((w) => <option key={w.id} value={w.id}>{w.item}</option>)}
                  <option value="other">Something else…</option>
                </select>
              </label>
              {item === "other" && <label>Describe it<input name="description" required maxLength={100} placeholder="e.g. Blankets" /></label>}
              <label>How many<input name="quantity" type="number" min="1" required /></label>
            </>
          )}

          <label>Date<input name="donated_on" type="date" required defaultValue={today()} /></label>
          <label>Status
            <select name="status" defaultValue="received"><option value="received">Received</option><option value="pending">Pending</option></select>
          </label>
          <button className="btn">Record donation</button>
        </form>
        {status.msg && <p className={`form-msg ${status.state}`} role="status">{status.msg}</p>}
      </section>

      <section className="history dash-pad-x">
        <h2>Latest donations</h2>
        <p className="history-sub">The 50 most recent. Only “Received” donations count towards the totals and the bars.</p>
        {list.length === 0 ? <p>No donations recorded yet.</p> : (
          <ul className="don-list">
            {list.map((d) => (
              <li className="don admin-don" key={d.id}>
                <span className={`don-ic ${d.kind}`}>{iconFor(d)}</span>
                <div><strong>{d.description}</strong><small>{d.donor} · {fmtDate(d.donated_on)}</small></div>
                <span className="don-qty">{qtyText(d)}</span>
                {d.status === "received"
                  ? <span className="status received">✓ Received</span>
                  : <button className="btn-ghost" onClick={() => markReceived(d.id)}>Mark received</button>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
