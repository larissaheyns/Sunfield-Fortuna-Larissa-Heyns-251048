import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import DonationList from "../../components/DonationList";

export default function Donations() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/me/donations").then(setItems).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="history dash-pad-x page-top">
      <Link className="more" to="/dashboard">← Back to overview</Link>
      <div className="history-head"><h2>All donations</h2></div>
      <p className="history-sub">Thank you for your continued support. Every item and donation makes a difference.</p>
      {error && <p className="form-msg err">{error}</p>}
      {items && <DonationList items={items} />}
    </section>
  );
}
