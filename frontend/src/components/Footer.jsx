import { Link } from "react-router-dom";
import { NAV, SITE } from "../data/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <h3>{SITE.name}</h3>
          <p>{SITE.tagline}</p>
        </div>
        <div>
          <h3>Explore</h3>
          <ul>{NAV.map(({ label, to }) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>
        </div>
        <div>
          <h3>Contact</h3>
          <p>{SITE.address}</p>
          <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
          <p>{SITE.phone}</p>
        </div>
        <p className="legal">© {new Date().getFullYear()} {SITE.name}. Community · Support · Hope</p>
      </div>
    </footer>
  );
}
