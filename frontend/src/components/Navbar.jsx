import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { NAV, SITE } from "../data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header>
      <div className="bar">
        <Link className="logo" to="/" onClick={close} aria-label={`${SITE.name} home`}>
          <img src={logo} alt="" />
        </Link>
        <button id="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>Menu</button>
        <nav id="nav" className={open ? "open" : ""} aria-label="Main">
          {NAV.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={close}>{label}</NavLink>
          ))}
          <Link className="login" to="/login" onClick={close}>Sign Up/Login</Link>
          <Link className="avatar" to="/login" onClick={close} aria-label="Your account">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f9f0e3" strokeWidth="2">
              <circle cx="12" cy="7" r="4" /><path d="M4 21c0-5 4-7 8-7s8 2 8 7" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
