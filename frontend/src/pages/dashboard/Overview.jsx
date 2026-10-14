import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import DonationList, { rand, fmtDate } from "../../components/DonationList";

const own = import.meta.glob("../../assets/dashboard.{png,jpg,jpeg,webp}", { eager: true, import: "default" });
const shared = import.meta.glob("../../assets/heroes/involved.{png,jpg,jpeg,webp}", { eager: true, import: "default" });
const photo = Object.values(own)[0] ?? Object.values(shared)[0];

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export default function Overview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/me/dashboard").then(setData).catch((e) => setError(e.message));
  }, []);

  const s = data?.stats;
  const STATS = [
    { tone: "gold", label: "Total given", value: s ? rand(s.total_given, 0) : "…",
      icon: <Svg><path d="M12 9s-3-1.8-3-4a1.8 1.8 0 0 1 3-1.2A1.8 1.8 0 0 1 15 5c0 2.2-3 4-3 4z" /><path d="M3 15h3l4 2h5l4-2a1.5 1.5 0 0 1 1.5 2.5L15 21H6l-3-2z" /></Svg> },
    { tone: "green", label: "Items donated", value: s ? s.items_donated : "…",
      icon: <Svg><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></Svg> },
    { tone: "gold", label: "Donor since", value: s ? (s.donor_since ? fmtDate(s.donor_since, { month: "short", year: "numeric" }) : "—") : "…",
      icon: <Svg><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg> },
  ];

  return (
    <>
      <section className="dash-hero">
        {photo && <img src={photo} alt="" />}
        <div>
          <h1>Welcome back, {user.first_name}</h1>
          <p>Here’s the difference you’ve made.</p>
        </div>
      </section>

      {error && <p className="dash-pad form-msg err">{error}</p>}

      <div className="stats dash-pad">
        {STATS.map((x) => (
          <div className="stat" key={x.label}>
            <span className={`stat-ic ${x.tone}`}>{x.icon}</span>
            <div><small>{x.label}</small><strong>{x.value}</strong></div>
          </div>
        ))}
      </div>

      <section className="history dash-pad-x">
        <div className="history-head">
          <h2>Donation history</h2>
          <Link className="more" to="/dashboard/donations">View all →</Link>
        </div>
        <p className="history-sub">Thank you for your continued support. Every item and donation makes a difference.</p>
        {data && <DonationList items={data.recent} />}
      </section>

      <p className="dash-note">Kindness builds stronger communities.</p>
    </>
  );
}
