import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import DonationList, { rand } from "../../components/DonationList";
import Meter from "../../components/Meter";

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const HAND = <Svg><path d="M12 9s-3-1.8-3-4a1.8 1.8 0 0 1 3-1.2A1.8 1.8 0 0 1 15 5c0 2.2-3 4-3 4z" /><path d="M3 15h3l4 2h5l4-2a1.5 1.5 0 0 1 1.5 2.5L15 21H6l-3-2z" /></Svg>;
const BOX = <Svg><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></Svg>;
const CAL = <Svg><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>;
const monthName = (ym) => new Date(ym + "-01T00:00:00").toLocaleDateString("en-US", { month: "short" });

export default function AdminOverview() {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api("/admin/overview").then(setD).catch((e) => setError(e.message)); }, []);

  const dash = "…";
  const STATS = [
    { tone: "gold", label: "Money received", value: d ? rand(d.totals.money, 0) : dash, icon: HAND },
    { tone: "green", label: "Items received", value: d ? d.totals.items : dash, icon: BOX },
    { tone: "gold", label: "Money this month", value: d ? rand(d.month.money, 0) : dash, icon: CAL },
    { tone: "green", label: "Items this month", value: d ? d.month.items : dash, icon: CAL },
  ];
  const max = d ? Math.max(1, ...d.monthly.map((m) => m.money)) : 1;

  return (
    <>
      <section className="dash-hero">
        <div><h1>Admin overview</h1><p>See what has been donated and what is still needed.</p></div>
      </section>
      {error && <p className="dash-pad form-msg err">{error}</p>}

      <div className="stats four dash-pad">
        {STATS.map((x) => (
          <div className="stat" key={x.label}>
            <span className={`stat-ic ${x.tone}`}>{x.icon}</span>
            <div><small>{x.label}</small><strong>{x.value}</strong></div>
          </div>
        ))}
      </div>

      {d && (
        <>
          <div className="admin-grid">
            <section className="history">
              <h2>Monthly donations</h2>
              <p className="history-sub">Money received each month, with items below.</p>
              <div className="chart">
                {d.monthly.map((m, i) => (
                  <div className={`chart-col${i === d.monthly.length - 1 ? " current" : ""}`} key={m.month}>
                    <div className="chart-bar" style={{ height: `${(m.money / max) * 100}%` }} title={rand(m.money)} />
                    <b>{monthName(m.month)}</b>
                    <small>{rand(m.money, 0)}</small>
                    <small>{m.items} items</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="history">
              <div className="history-head"><h2>Recent donations</h2><Link className="more" to="/dashboard/admin/donations">Record / view all →</Link></div>
              <p className="history-sub">The latest donations from everyone.</p>
              <DonationList items={d.recent} />
            </section>
          </div>

          <section className="history dash-pad-x">
            <div className="history-head"><h2>Wishlist</h2><Link className="more" to="/dashboard/admin/wishlist">Manage wishlist →</Link></div>
            <p className="history-sub">Green bars show how much of the wanted amount has been donated.</p>
            <div className="table-scroll">
              <table className="wl-table stack">
                <thead><tr><th>Item</th><th>Category</th><th>Received</th><th>Progress</th></tr></thead>
                <tbody>
                  {d.wishlist.map((w) => (
                    <tr key={w.id}>
                      <td><strong>{w.item}</strong></td><td data-label="Category">{w.category}</td>
                      <td data-label="Received">{w.received} / {w.quantity_needed}</td>
                      <td className="meter-cell" data-label="Progress"><Meter value={w.received} max={w.quantity_needed} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
