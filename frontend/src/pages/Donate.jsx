import { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { heroFor } from "../data/heroes";
import "../styles/donate.css";

const Icon = ({ children }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{children}</svg>
);

const OPTIONS = [
  {
    key: "items",
    title: "Donate items",
    text: "Food, toiletries, nappies and other essentials from our wishlist.",
    icon: <Icon><path d="M8 24h48v10H8zM12 34h40v22H12zM32 24v32" /><path d="M32 24c-6-12-18-10-14-4s14 4 14 4zm0 0c6-12 18-10 14-4s-14 4-14 4z" /></Icon>,
  },
  {
    key: "money",
    title: "Donate money",
    text: "A gift of any size helps us provide safety, care and opportunity.",
    icon: <Icon><circle cx="32" cy="32" r="22" /><path d="M32 18v28M38 25c-1-3-4-4-6-4-4 0-7 2-7 5 0 7 14 3 14 11 0 3-3 5-7 5-3 0-6-2-7-5" /></Icon>,
  },
];

const PANELS = {
  items: (
    <>
      
      <div className="donate-actions">
        <Link className="btn" to="/involved">See our wishlist <span aria-hidden="true">→</span></Link>
        <Link className="more" to="/contact">Contact us →</Link>
      </div>
    </>
  ),
  money: (
    <>
      
      <div className="donate-actions">
        <button className="btn is-disabled" disabled>Donate money – coming soon</button>
        <Link className="more" to="/contact">Contact us →</Link>
      </div>
    </>
  ),
};

export default function Donate() {
  const [choice, setChoice] = useState("items");
  const current = OPTIONS.find((o) => o.key === choice);

  return (
    <>
      <Hero {...heroFor("donate")} />
      <section className="wrap page-body donate">
        <p className="badge">Under construction</p>
        <h2>How would you like to give?</h2>
        <div className="donate-options">
          {OPTIONS.map((o) => (
            <button key={o.key} className="option" aria-pressed={choice === o.key} onClick={() => setChoice(o.key)}>
              {o.icon}
              <strong>{o.title}</strong>
              <span>{o.text}</span>
            </button>
          ))}
        </div>
        <div className="donate-panel" aria-live="polite">
          <h3>{current.title}</h3>
          <p className="badge">Coming soon</p>
          {PANELS[choice]}
        </div>
      </section>
    </>
  );
}
