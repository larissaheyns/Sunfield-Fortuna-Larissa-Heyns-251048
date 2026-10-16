import { Link } from "react-router-dom";
import { analyticsConfigured, setChoice, useConsent } from "../lib/analytics";
import "../styles/cookie.css";

export default function CookieBanner() {
  const choice = useConsent();
  if (!analyticsConfigured || choice) return null;
  return (
    <div className="cookie" role="region" aria-label="Cookie notice">
      <p>
        We would like to use Google Analytics cookies to see how our website is used so we can improve it.
        They are only set if you accept. <Link to="/privacy">Privacy notice</Link>
      </p>
      <div className="cookie-actions">
        <button className="btn-ghost" onClick={() => setChoice("declined")}>Decline</button>
        <button className="btn" onClick={() => setChoice("accepted")}>Accept</button>
      </div>
    </div>
  );
}
