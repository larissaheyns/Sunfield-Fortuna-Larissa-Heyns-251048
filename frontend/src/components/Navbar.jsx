import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { NAV, SITE } from "../data/site";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
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
          {user
            ? <button className="login" onClick={() => { logout(); close(); }}>Log out</button>
            : <Link className="login" to="/signup" onClick={close}>Sign Up/Login</Link>}
        </nav>
      </div>
    </header>
  );
}
