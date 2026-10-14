import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/dashboard.css";
import "../styles/admin.css";

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const I = {
  home: <Svg><path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" /></Svg>,
  user: <Svg><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.5 3.6-7 8-7s8 2.5 8 7" /></Svg>,
  heart: <Svg><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" /></Svg>,
  book: <Svg><path d="M4 4h7a2 2 0 0 1 1 .3A2 2 0 0 1 13 4h7v15h-7a2 2 0 0 0-2 1 2 2 0 0 0-2-1H4z" /><path d="M12 5v15" /></Svg>,
  list: <Svg><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></Svg>,
  gift: <Svg><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></Svg>,
};

const MEMBER_LINKS = [
  { to: "/dashboard", label: "Overview", end: true, icon: I.home },
  { to: "/dashboard/profile", label: "Profile", icon: I.user },
];
const ADMIN_LINKS = [
  { to: "/dashboard/admin", label: "Overview", end: true, icon: I.home },
  { to: "/dashboard/admin/wishlist", label: "Wishlist", icon: I.list },
  { to: "/dashboard/admin/donations", label: "Donations", icon: I.gift },
  { to: "/dashboard/profile", label: "Profile", icon: I.user },
];
const SITE_LINKS = [
  { to: "/donate", label: "Donate", icon: I.heart },
  { to: "/contact", label: "Contact Us", icon: I.book },
];

export default function DashboardLayout() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  if (!ready) return <div className="sf dash-loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  const link = (l) => <NavLink key={l.to} to={l.to} end={l.end}>{l.icon}{l.label}</NavLink>;
  return (
    <div className="sf dash">
      <aside className="dash-side">
        <Link to="/" aria-label="Sunfield Fortuna home"><img className="dash-logo" src={logo} alt="" /></Link>
        <div className="dash-nav" role="navigation" aria-label="Dashboard">
          {(user.role === "admin" ? ADMIN_LINKS : MEMBER_LINKS).map(link)}
          <hr />
          {SITE_LINKS.map(link)}
        </div>
        <button className="dash-logout" onClick={async () => { await logout(); navigate("/"); }}>Log out</button>
      </aside>
      <main className="dash-main"><Outlet /></main>
    </div>
  );
}
