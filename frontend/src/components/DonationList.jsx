import { Link } from "react-router-dom";

export const rand = (n, dec = 2) =>
  "R" + Number(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
export const fmtDate = (s, opts = { month: "short", day: "numeric", year: "numeric" }) =>
  new Date(s + "T00:00:00").toLocaleDateString("en-US", opts);

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
export function iconFor(d) {
  if (d.kind === "money") return <Svg><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></Svg>;
  if (/cloth|shirt/i.test(d.description)) return <Svg><path d="M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z" /></Svg>;
  if (/book/i.test(d.description)) return <Svg><path d="M4 4h4v16H4zM10 4h4v16h-4zM16 6l4 1-3 13-4-1z" /></Svg>;
  return <Svg><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></Svg>;
}
export const qtyText = (d) => (d.kind === "money" ? rand(d.amount) : `${d.quantity} item${d.quantity === 1 ? "" : "s"}`);

export default function DonationList({ items }) {
  if (!items.length) {
    return (
      <div className="don-empty">
        <p>No donations yet. When you give, they will appear here.</p>
        <Link className="btn" to="/donate">Donate <span aria-hidden="true">→</span></Link>
      </div>
    );
  }
  return (
    <ul className="don-list">
      {items.map((d) => (
        <li className="don" key={d.id}>
          <span className={`don-ic ${d.kind}`}>{iconFor(d)}</span>
          <div><strong>{d.description}</strong><small>{d.donor ? `${d.donor} · ` : ""}{fmtDate(d.donated_on)}</small></div>
          <span className="don-qty">{qtyText(d)}</span>
          <span className={`status ${d.status}`}>{d.status === "received" ? "✓ Received" : "Pending"}</span>
        </li>
      ))}
    </ul>
  );
}
