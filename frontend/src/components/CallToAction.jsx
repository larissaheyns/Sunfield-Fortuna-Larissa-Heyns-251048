import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="cta">
      <div className="wrap">
        <p className="hand">Together we can<br />make a difference.</p>
        <div>
          <p>Your support helps us provide safety, care and opportunity to those who need it most.</p>
          <Link className="btn" to="/involved">Get involved <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <svg className="leaf" viewBox="0 0 100 200" fill="currentColor" aria-hidden="true">
        <path d="M50 200V40" stroke="currentColor" strokeWidth="3" fill="none" />
        <ellipse cx="30" cy="90" rx="14" ry="30" transform="rotate(-30 30 90)" />
        <ellipse cx="70" cy="120" rx="14" ry="30" transform="rotate(30 70 120)" />
        <ellipse cx="32" cy="150" rx="14" ry="30" transform="rotate(-30 32 150)" />
        <ellipse cx="50" cy="26" rx="10" ry="22" fill="#f1b84f" />
      </svg>
    </section>
  );
}

